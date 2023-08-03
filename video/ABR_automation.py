import os
import subprocess
import boto3
import psycopg2
import shutil
import dotenv
import time
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
    aws_access_key_id = os.getenv("AWS_access_key"),
    aws_secret_access_key = os.getenv("AWS_secret_key"),
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

    filename = f"{prefix}{index_dict[prefix]:02d}"
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


def create_variant_m3u8(file_path, segments):
    with open(file_path, "w") as f:
        f.write("#EXTM3U\n")

        for segment in segments:
            f.write(f"#EXT-X-STREAM-INF:PROGRAM-ID=1,BANDWIDTH={segment['BANDWIDTH']},\n")
            f.write(f"{segment['url']}\n")

    s3 = session.client("s3")
    s3.upload_file(file_path, bucket_name, os.path.basename(file_path))   


def download_and_convert(playlist_url, prefix, quality_list, topicId):
    for quality in quality_list:
        quality_name = quality["name"]
        quality_profile = quality["profile"]
        quality_level = quality["level"]
        quality_resolution = quality["resolution"]
        quality_time = quality["time"]
        quality_bitrate = quality["bitrate"]

        print(f"{quality_name} 퀄리티로 HLS 파일 생성 중...")

        # playlist의 영상 다운로드
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
                quality_time,
                "-hls_list_size",
                "0",
                "-b:v",
                quality_bitrate,
                "-f",
                "hls",
                dest_file,
            ]
            subprocess.run(command)

    # modify_m3u8_file()


    # 퀄리티별로 생성된 m3u8 파일들을 포함한 variant m3u8 파일 생성
    segments = [
        {"BANDWIDTH": 1280000, "url": f"{new_name}_L.m3u8"},
        {"BANDWIDTH": 2560000, "url": f"{new_name}_M.m3u8"},
        {"BANDWIDTH": 7680000, "url": f"{new_name}_H.m3u8"},
    ]
    create_variant_m3u8(os.path.join(output_directory, f"{new_name}_variant.m3u8"), segments)

    # S3 업로드 (퀄리티별로 생성된 ts 파일들을 S3에 업로드)
    upload_s3(file_name, new_name, quality_name, topicId)

    # 원본 .mp4 파일을 output 디렉토리로 이동 
    shutil.move(source_file, os.path.join(output_directory, file_name))

# 함수 실행
playlist_url = "https://www.youtube.com/watch?v=rAiKQMfcqYA"
start_time = time.time()
download_and_convert(playlist_url, "h", abr_qualities, 1)
end_time = time.time()
execution_time = end_time - start_time
print(f"실행 시간 ======> {execution_time}초")



# view 파일 생성되도록 
# 영상 다운로드를 for문 밖으로 빼기
# 여러파일이 다운로드 되었을 때의 이름 변경
# 여러파일이 다운로드 될 때 로직 확인