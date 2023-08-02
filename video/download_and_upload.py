import os
import subprocess
import boto3
import psycopg2
import shutil

# upload_s3, save db
dbname = "db4"
user = "test"
password = "test"
host = "localhost"
port = "5432"

conn_str = f"dbname={dbname} user={user} password={password} host={host} port={port}"
bucket_name = "eduplaym"

session = boto3.Session(
    aws_access_key_id="AKIAY6GK3SGEYA7AOJO5",
    aws_secret_access_key="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",
)


# 경로 설정
path = "/Users/heojisu/video"
source_directory = f"{path}/original"
process_directory = f"{path}/process"
output_directory = f"{path}/output"

index_dict = {}
# id_index = 5


def generate_filename(prefix):
    if prefix not in index_dict:
        index_dict[prefix] = 1

    filename = f"{prefix}{index_dict[prefix]:03d}{prefix}"
    index_dict[prefix] += 1
    return filename


def get_video_length(file_path):
    result = subprocess.run(
        [
            "ffprobe",
            "-v",
            "error",
            "-show_entries",
            "format=duration",
            "-of",
            "default=noprint_wrappers=1:nokey=1",
            file_path,
        ],
        stdout=subprocess.PIPE,
        stderr=subprocess.STDOUT,
    )
    return float(result.stdout)


def convert_to_hls(prefix, quality, topicId):
    conn = psycopg2.connect(conn_str)
    cur = conn.cursor()
    id_index = 8

    # original 폴더에 있는 모든 파일을 변환
    for file_name in os.listdir(source_directory):
        if not file_name.endswith(".mp4"):
            continue
        source_file = os.path.join(
            source_directory, file_name
        )  # '/Users/heojisu/video/original/original_name3.mp4'
        new_name = generate_filename(prefix)
        dest_file = os.path.join(
            process_directory, f"{new_name}.m3u8"
        )  # '/Users/heojisu/video/process/b001b.m3u8'

        command = [
            "ffmpeg",
            "-i",
            source_file,
            "-profile:v",
            "baseline",
            "-level",
            "3.0",
            "-s",
            "640x360",
            "-start_number",
            "0",
            "-hls_time",
            "10",
            "-hls_list_size",
            "0",
            "-f",
            "hls",
            dest_file,
        ]
        subprocess.run(command)

        # original 폴더) DB 저장
        video_length = get_video_length(source_file)

        # cur.execute('SELECT * FROM "File"')
        # records = cur.fetchall()
        # print(records)

        file_name_excl_ext = file_name[:-4]

        cur.execute(
            'INSERT INTO "File" ("id", "original_name", "name", "length", "quality", "topicId") \
                        VALUES (%s, %s, %s, %s, %s, %s)',
            (
                id_index + 1,
                file_name_excl_ext,
                new_name,
                video_length,
                quality,
                topicId,
            ),
        )
        id_index += 1
        conn.commit()

        # process 폴더) S3 업로드 (subprocess.run을 하면 process 폴더에 ts 파일들이 전부 생성된 상태.)
        upload_s3(file_name, new_name, quality, topicId)

        # 원본 .mp4 파일을 output 디렉토리로 이동 (S3 업로드까지 완료되어야 옮겨짐)
        shutil.move(source_file, os.path.join(output_directory, file_name))  # 작동 안함.

    conn.close()


def upload_s3(file_name, new_name, quality, topicId):
    s3 = session.client("s3")

    # S3 업로드
    for file_name in os.listdir(process_directory):  # 'b001b7.ts'
        local_path = os.path.join(
            process_directory, file_name
        )  # '/Users/heojisu/video/process/b001b7.ts'
        s3.upload_file(local_path, bucket_name, file_name)

        # 변환된 파일들을 process 디렉토리에서 output 디렉토리로 이동
        shutil.move(local_path, os.path.join(output_directory, file_name))


# convert_to_hls("b", "M", 1)


def download_and_convert(playlist_url, prefix, quality, topicId):
    # playlist의 모든 영상 다운로드
    command = [
        "yt-dlp",
        "-f",
        "bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best",
        "-o",
        f"{source_directory}/%(title)s.%(ext)s",
        "-v",
        playlist_url,
    ]
    subprocess.run(command)

    # original 폴더에 다운로드된 모든 파일을 HLS로 변환
    convert_to_hls(prefix, quality, topicId)


# 함수 실행
playlist_url = "https://www.youtube.com/watch?v=3KFH75m6sM0&list=PLRG4mOA39pL9WJkOpXBcMr4RjLHk9e9_3"
download_and_convert(playlist_url, "b", "M", 1)


# 샘플 플레이리스트
# url_list = [
# "https://www.youtube.com/watch?v=SzXWUdp4ibE&list=PLcQFUjwl9703Kl_iQc7IrH7_xuTxVPwLw"
# 'https://www.youtube.com/watch?v=0daUXxrWipQ&list=PLcQFUjwl9700rBN-6PtYL1jBFoyQ_YAB0',
# 'https://www.youtube.com/watch?v=iP4ncoaNj7U&list=PLYNja5Mm_Ma7udPS4Ujcqfhm8MQHdsHCi',
# 'https://www.youtube.com/watch?v=bGPZhzAeBdQ&list=PL5iY69aga81xUK7lLlrmzKh_ybiQ8eRre',
# 'https://www.youtube.com/watch?v=p2m9m535p9Y&list=PLF5FhqjeJXdNqzfqPRSGdkI4HTBn1w2CY'
# ]
