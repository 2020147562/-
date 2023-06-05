const express = require('express');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const cheerio = require('cheerio');
const moment = require('moment');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 50000;

app.use(express.json());
app.use(express.static('public'));
app.use(cors());

// 날씨에서 사용
app.get('/search', async (req, res) => {
  const dataset = req.query.dataset;
  const searchUrl = `https://www.10000recipe.com/recipe/list.html?q=${encodeURIComponent(dataset)}`;

  try {
    const response = await axios.get(searchUrl);
    const html = response.data;

    const $ = cheerio.load(html);

    // 텍스트 추출
    const text = $('.rcp_m_list2 .common_sp_list_ul.ea4 .common_sp_list_li .common_sp_caption .common_sp_caption_tit.line2').map(function() {
      return $(this).text().trim();
    }).get();

    //링크 추출
    const linkUrls = $('.rcp_m_list2 .common_sp_list_ul.ea4 .common_sp_list_li .common_sp_thumb a').map(function() {
      const url = $(this).attr('href');
      return 'https://www.10000recipe.com' + url;
    }).get();

    // 이미지 URL 추출
    const imageUrls = $('.rcp_m_list2 .common_sp_list_ul.ea4 .common_sp_list_li .common_sp_thumb img').map(function() {
      return $(this).attr('src');
    }).get();

   
    const result = {
      text,
      linkUrls,
      imageUrls
    };

    res.json(result);
  } catch (error) {
    console.log("크롤링 실패: ", error);
    res.status(500).send('크롤링 실패');
  }
});

// 루트 엔드포인트에서 실행하는 파일 : mainPage.html
app.get('/', (req, res) => {
  const profile_html_filePath = path.join(__dirname, 'public', 'mainPage.html');
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

// 서버에서 recipe정보가 담긴 json 파일을 전송한다.
app.post('/recipe2.json', (req, res) => {
  res.sendFile(__dirname + '/public/recipe2.json');
})

// ID 비번 확인 후 유저 프로필 정보 전송
app.post('/get_user_profile', (req, res) => {
  const {ID, password} = req.body;

  // profiles.json 파일 경로 설정
  const profiles_json_filePath = path.join(__dirname, 'public', 'profiles.json');

  // json 파일 읽기
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

    // ID 비번 일치하는 프로필 정보를 wanted_profile에 담는다
    // ID와 password가 일치하는 프로필 정보를 찾기
    let wanted_profile = null;
    for (let i = 0; i < profiles.length; i++) {
      if (profiles[i].id === ID && profiles[i].password === password) {
        wanted_profile = profiles[i];
        break;
      }
    }

    // 로그인한 유저의 프로필 저장
    const user_profile_json_filePath = path.join(__dirname, 'public', 'user_profile.json'); 
    fs.writeFileSync(user_profile_json_filePath, JSON.stringify(wanted_profile, null, 2), 'utf8', (err) => {
      if (err) {
        console.error(err);
        res.status(500).send('서버 에러');
        return;
      }
      else {
        res.status(201).send('프로필 추가 성공!');
      }
    });

    // 프로필 정보 전송
    res.send(wanted_profile);
  })
})

// 유저 프로필 전송
app.post('/get_logined_user_profile', (req, res) => {
  const user_profile_json_filePath = path.join(__dirname, 'public', 'user_profile.json');
  let user_profile = null;
  fs.readFile(user_profile_json_filePath, 'utf8', (err, data) => {
    user_profile = data;
    res.send(user_profile);
  })
})

// 추천 레시피 파일 이름 저장
app.post('/recipeName.json', (req, res) => {
  const recommend_recipe = req.body;
  const recipeName_json_filePath = path.join(__dirname, 'public', 'recipeName.json');
  fs.writeFileSync(recipeName_json_filePath, JSON.stringify(recommend_recipe, null, 2), 'utf8', (err) => {
    res.send(recommend_recipe);
  })
})

// 추천 레시피 파일 이름 전송
app.post('/get_recipeName', (req, res) => {
  const recipeName_json_filePath = path.join(__dirname, 'public', 'recipeName.json');
  let recipeName = null;
  fs.readFile(recipeName_json_filePath, 'utf8', (err, data) => {
    recipeName = data;
    res.send(recipeName);
  })
})

// 회원가입 제출 버튼 클릭시 마이페이지 전송
// app.post('/toMypage', (req, res) => {
//   const myPage_html_filePath = path.join(__dirname, 'public', 'myPage.html');
//   res.sendFile(myPage_html_filePath);
// });

app.listen(PORT, () => {
  console.log(`서버주소: http://localhost:${PORT}`);
});