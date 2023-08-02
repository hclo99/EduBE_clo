import os
import subprocess
import boto3
import psycopg2
import shutil
import dotenv
from ABR_quality import abr_qualities

dotenv.load_dotenv()
dbname = os.getenv("PY_DB")
user = os.getenv("PY_USERNAME")
password = os.getenv("PY_PASSWORD")
host = os.getenv("PY_HOST")
port = os.getenv("PY_PORT")

conn_str = f"dbname={dbname} user={user} password={password} host={host} port={port}"
bucket_name = os.getenv("S3_BUCKETNAME")

session = boto3.Session(
    aws_access_key_id="AKIAY6GK3SGEYA7AOJO5",
    aws_secret_access_key="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",
)

# 경로 설정
path = "c:/Users/jungh/Downloads"
source_directory = f"{path}/original"
process_directory = f"{path}/process"
output_directory = f"{path}/output"

index_dict = {}

def generate_filename(prefix):
    if prefix not in index_dict:
        index_dict[prefix] = 1

    filename = f"{prefix}{index_dict[prefix]:01d}"
    index_dict[prefix] += 1
    return filename


def upload_s3(file_name, new_name, quality, topicId):
    s3 = session.client("s3")

    # S3 업로드
    for file_name in os.listdir(process_directory):  
        local_path = os.path.join(
            process_directory, file_name
        ) 
        s3.upload_file(local_path, bucket_name, file_name)

        # 변환된 파일들을 process 디렉토리에서 output 디렉토리로 이동
        shutil.move(local_path, os.path.join(output_directory, file_name))


def download_and_convert(playlist_url, prefix, quality_list, topicId):
    for quality in quality_list:
        quality_name = quality["name"]
        quality_profile = quality["profile"]
        quality_level = quality["level"]
        quality_resolution = quality["resolution"]
        quality_bitrate = quality["bitrate"]

        print(f"{quality_name} 퀄리티로 HLS 파일 생성 중...")

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

        # original 폴더에 다운로드된 모든 파일을 해당 퀄리티로 HLS로 변환
        for file_name in os.listdir(source_directory):
            if not file_name.endswith(".mp4"):
                continue
            source_file = os.path.join(source_directory, file_name)
            new_name = generate_filename(prefix)
            dest_file = os.path.join(process_directory, f"{new_name}_{quality_name}.m3u8")

            command = [
                "ffmpeg",
                "-i",
                source_file,
                "-profile:v",
                quality_profile,
                "-level",
                quality_level,
                "-s",
                quality_resolution,
                "-start_number",
                "0",
                "-hls_time",
                "10",
                "-hls_list_size",
                "0",
                "-b:v",
                quality_bitrate,
                "-f",
                "hls",
                dest_file,
            ]
            subprocess.run(command)

            # S3 업로드 (퀄리티별로 생성된 ts 파일들을 S3에 업로드)
            upload_s3(file_name, new_name, quality_name, topicId)

            # 원본 .mp4 파일을 output 디렉토리로 이동 (S3 업로드까지 완료되어야 옮겨짐)
            shutil.move(source_file, os.path.join(output_directory, file_name))


# 함수 실행
playlist_url = "https://www.youtube.com/watch?v=rAiKQMfcqYA"
download_and_convert(playlist_url, "b", abr_qualities, 1)


# b01_H , b02_M 이런식으로 되는 중! 수정 필요
# variant 파일 생성되도록
# view 파일 생성되도록 