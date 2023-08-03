abr_qualities = [
    {
        "name": "H",
        "profile": "high",
        "level": "4.0",
        "resolution": "1280x720",
        "time":"3",
        "bitrate": "1000k",
    },
    {
        "name": "M",
        "profile": "main",
        "level": "3.0",
        "resolution": "640x360",
        "time":"3",
        "bitrate": "300k",
    },
    {
        "name": "L",
        "profile": "baseline",
        "level": "3.0",
        "resolution": "426x240",
        "time":"3",
        "bitrate": "100k",
    },
    {
        "name": "view",
        "profile": "baseline",
        "level": "3.0",
        "resolution": "320x180",
        "time":"70",
        "bitrate": "10k",
    },
]


# 고화질 파일
# ffmpeg -i /Users/jungh/Downloads/a05a.mp4 -profile:v high -level 4.0 -s 1280x720 -start_number 0 -hls_time 4 -hls_list_size 0 -b:v 6000k -hls_segment_filename /Users/jungh/Downloads/a05a_high_%01d.ts /Users/jungh/Downloads/a05a_H.m3u8

# 중간화질 파일
# ffmpeg -i /Users/jungh/Downloads/a05a.mp4 -profile:v main -level 3.0 -s 640x360 -start_number 0 -hls_time 4 -hls_list_size 0 -b:v 800k -hls_segment_filename /Users/jungh/Downloads/a05a_medium_%01d.ts /Users/jungh/Downloads/a05a_M.m3u8

# 저화질 파일
# ffmpeg -i /Users/jungh/Downloads/a05a.mp4 -profile:v baseline -level 3.0 -s 426x240 -start_number 0 -hls_time 4 -hls_list_size 0 -b:v 100k -hls_segment_filename /Users/jungh/Downloads/a05a_low_%01d.ts /Users/jungh/Downloads/a05a_L.m3u8

# 썸네일 파일 
# ffmpeg -i /Users/jungh/Downloads/a00.mp4 -profile:v baseline -level 3.0 -vf "scale=iw/4:-1" -hls_time 70 -b:v 2k -hls_list_size 0 -f hls /Users/jungh/Downloads/a00-view.m3u8