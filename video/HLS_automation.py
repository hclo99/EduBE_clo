import os
import subprocess
import uuid
import boto3
import psycopg2
from youtube_dl import YoutubeDL
import dotenv
from ABS_quality import ABS_quality

path = "/Users/jungh/Downloads"

dotenv.load_dotenv()
dbname = os.getenv("PY_DB")
user = os.getenv("PY_USERNAME")
password = os.getenv("PY_PASSWORD")
host = os.getenv("PY_HOST")
port = os.getenv("PY_PORT")

conn_str = f"dbname={dbname} user={user} password={password} host={host} port={port}"

bucket_name = os.getenv("S3_BUCKETNAME")

aws_access_key = os.getenv("AWS_access_key")
aws_secret_key = os.getenv("AWS_secret_key")

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
    
def convert_to_hls(original_name, new_name, source_file, bucket_name, conn_str, abs_qualities):
    s3 = boto3.client("s3", aws_access_key, aws_secret_key)
    conn = psycopg2.connect(conn_str)
    cur = conn.cursor()

    # HLS 변환) Create a unique directory for each HLS conversion
    hls_directory = os.path.join(path, new_name)  # hls 파일들을 저장할 폴더 경로 생성
    os.makedirs(hls_directory, exist_ok=True)  # 실제 폴더 생성
    dest_file = os.path.join(
        hls_directory, f"{new_name}.m3u8"
    )  # 기존 path가 아니라 생성된 폴더내. full 경로&파일명
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

    video_length = get_video_length(source_file)

    # S3 업로드) Upload all files in HLS directory to S3
    for file in os.listdir(hls_directory):  # 폴더내 파일들을 리스트로
        #  업로드할 파일의 경로, 버킷명, S3 버킷내 저장할 파일명
        s3.upload_file(
            os.path.join(hls_directory, file), bucket_name, file
        )  # f'{new_name}/{file}' 폴더구조는 너무 길어질듯.
        # s3_url = f"https://{bucket_name}.s3.amazonaws.com/{file}"

        # DB 저장) 유저id는 임의로 입력 ***
        cur.execute(
            "INSERT INTO File (original_name, new_name, length) \
                    VALUES (%s, %s, %s)",
            (original_name, new_name, video_length),
        )

def download_from_playlist(playlist_urls, bucket_name, conn_str):
    print("fr: ", playlist_urls)
    ydl_opts = {
        "outtmpl": f"{path}/%(title)s.%(ext)s",
    }
    uploaded_files = []

    with YoutubeDL(ydl_opts) as ydl:
        for url in playlist_urls:
            # 딕셔너리
            info_dict = ydl.extract_info(url, download=True)
            original_name = info_dict.get("title", None)  # 원래 파일명

            new_name = str(uuid.uuid4())
            source_file = (
                f'{path}/{original_name}.{info_dict["ext"]}'  # full name=파일명과 확장자
            )
            os.rename(
                source_file, f'{path}/{new_name}.{info_dict["ext"]}'
            )  # uuid로 확장자 변경
            source_file = (
                f'{path}/{new_name}.{info_dict["ext"]}'  # 변경된 파일경로. 원본 파일명은 변수로 전달
            )

            # 파일명(name), 경로(source_file)
            convert_to_hls(original_name, new_name, source_file, bucket_name, conn_str)
            uploaded_files.append(new_name)

    return uploaded_files


playlist_urls = [
    "https://www.youtube.com/watch?v=SzXWUdp4ibE&list=PLcQFUjwl9703Kl_iQc7IrH7_xuTxVPwLw"
    # 'https://www.youtube.com/watch?v=0daUXxrWipQ&list=PLcQFUjwl9700rBN-6PtYL1jBFoyQ_YAB0',
    # 'https://www.youtube.com/watch?v=iP4ncoaNj7U&list=PLYNja5Mm_Ma7udPS4Ujcqfhm8MQHdsHCi',
    # 'https://www.youtube.com/watch?v=bGPZhzAeBdQ&list=PL5iY69aga81xUK7lLlrmzKh_ybiQ8eRre',
    # 'https://www.youtube.com/watch?v=p2m9m535p9Y&list=PLF5FhqjeJXdNqzfqPRSGdkI4HTBn1w2CY'
]

uploaded_files = download_from_playlist(playlist_urls, bucket_name, conn_str)
print(uploaded_files)