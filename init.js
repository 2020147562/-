const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 10683;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// 루트 엔드포인트에서 실행하는 파일 : profile.html -> 추후 메인페이지로 변경 필요!!!!!
app.get('/', (req, res) => {
  const profile_html_filePath = path.join(__dirname, 'public', 'profile.html');
  res.sendFile(profile_html_filePath);
});

// 회원가입 제출 버튼을 누르면 해당 프로필을 profiles.json에 추가
app.post('/add-profile', (req, res) => {
  const newProfile = req.body;

  // profiles.json 파일 경로 설정
  const profiles_json_filePath = path.join(__dirname, 'public', 'profiles.json');

  // profiles.json 파일 읽기
  fs.readFile(profiles_json_filePath, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send('서버 에러');
      return;
    }

    let profiles = [];
    try {
      profiles = JSON.parse(data);
    } catch (err) {
      console.error(err);
      res.status(500).send('서버 에러');
      return;
    }

    // 새로운 프로필 추가
    profiles.push(newProfile);

    // profiles.json 파일에 쓰기
    fs.writeFile(profiles_json_filePath, JSON.stringify(profiles, null, 2), 'utf8', (err) => {
      if (err) {
        console.error(err);
        res.status(500).send('서버 에러');
        return;
      }
      else {
        res.status(201).send('프로필 추가 성공!');
      }
    });
  });
});

// 회원가입 제출 버튼 클릭시 마이페이지 전송
// app.post('/toMypage', (req, res) => {
//   const myPage_html_filePath = path.join(__dirname, 'public', 'myPage.html');
//   res.sendFile(myPage_html_filePath);
// });

app.listen(PORT, () => {
  console.log(`서버주소: http://localhost:${PORT}`);
});