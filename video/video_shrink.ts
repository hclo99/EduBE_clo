import { Controller, Get } from '@nestjs/common';
import { spawn } from 'child_process';

@Controller('video')
export class VideoController {
  @Get('compress')
  async compressVideo() {
    try {
      const inputVideoPath = '"C:/Users/jungh/Downloads/shurek1.mp4"'; // 원본 동영상 파일 경로
      const outputVideoPath = 'C:/Users/jungh/Downloads/change.mp4'; // 압축된 동영상 파일 경로
      const qualityLevel = '23'; // 퀄리티 조절 (낮을수록 높은 퀄리티, 0 ~ 51 사이 값)

      // ffmpeg 명령어 실행
      const ffmpegCommand = `ffmpeg -i ${inputVideoPath} -crf ${qualityLevel} ${outputVideoPath}`;
      const ffmpegProcess = spawn(ffmpegCommand, { shell: true });

      ffmpegProcess.on('close', (code) => {
        console.log(`ffmpeg process exited with code ${code}`);
      });

      ffmpegProcess.on('error', (err) => {
        console.error('Error during ffmpeg execution:', err);
      });

      return { message: '동영상 압축이 완료되었습니다.' };
    } catch (error) {
      console.error('압축 중 오류 발생:', error);
      throw new Error('압축 중 오류가 발생했습니다.');
    }
  }
}

// import { Controller, Get } from '@nestjs/common';
// import { spawn } from 'child_process';

// @Controller('video')
// export class VideoController {
//   @Get('compress')
//   async compressVideo() {
//     try {
//       const inputVideoPath = 'shurek1.mp4'; // 원본 동영상 파일 경로
//       const outputVideoPath = 'output_shurek1.mp4'; // 압축된 동영상 파일 경로
//       const frameSkip = 10; // 프레임 간격 설정 (숫자가 작을수록 높은 퀄리티, 1은 모든 프레임을 사용)

//       // ffmpeg 명령어 실행
//       const ffmpegCommand = `ffmpeg -i ${inputVideoPath} -vf select='not(mod(n\\,${frameSkip}))' ${outputVideoPath}`;
//       const ffmpegProcess = spawn(ffmpegCommand, { shell: true });

//       ffmpegProcess.on('close', (code) => {
//         console.log(`ffmpeg process exited with code ${code}`);
//       });

//       ffmpegProcess.on('error', (err) => {
//         console.error('Error during ffmpeg execution:', err);
//       });

//       return { message: '동영상 압축이 완료되었습니다.' };
//     } catch (error) {
//       console.error('압축 중 오류 발생:', error);
//       throw new Error('압축 중 오류가 발생했습니다.');
//     }
//   }
// }
