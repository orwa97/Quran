"use strict";

// SELECT ELEMENTS
const readingBar = document.querySelector(".header__reading-bar");
const topPage = document.querySelector(".page--top");
const surahPages = document.querySelector(".surah-contents");
// const surahCard = document.querySelector(`${global.surah}`);
// const juzCard = document.querySelector(global.juz);
// const surahNum = document.querySelector(global.surahNum);

const barOffsetTop = readingBar.offsetTop;

const makeItStick = function () {
  if (window.pageYOffset > barOffsetTop) {
    readingBar.classList.add("sticky");
    // add comment
    // topPage.children[0].style.visibility = "hidden";
  } else {
    readingBar.classList.remove("sticky");
    // add comment
    // topPage.children[0].style.visibility = "visible";
  }
};

// call the stick function when scrolling
window.onscroll = function () {
  makeItStick();
};

/**
 *
 * @param {string} url api endpoint
 */
const getJson = function (url) {
  return fetch(url).then((res) => res.json());
};

// let pages;
// const getChaperByID = async function (id) {
//   const { chapter } = await getJson(
//     `https://api.quran.com/api/v4/chapters/${id}`
//   );
//   console.log(chapter);
//   pages = chapter.pages;
//   console.log(pages);
//   //   getVersesBypage(pages[0]);
//   // const pageVerses = [];
//   // for (let page = pages[0]; page <= pages[1]; page++) {
//   //   await pageVerses.push(getVersesBypage(page));
//   // }

//   return pages;
// };

// GET  CHAPTER'S VERSES BY ITS ID
// const getVersesBypage = async function (page) {
//   const verses = [];
//   getJson(
//     `https://api.quran.com/api/v4/quran/verses/uthmani?page_number=${page}`
//   )
//     .then((res) => {
//       const results = res.verses;
//       results.forEach((el) => {
//         verses.push(el.text_uthmani);
//       });
//     })
//     .catch((e) => {
//       console.error(e.message);
//     });

//   // getChaperByID()
//   const pageVerses = [];
//   for (let page = pages[0]; page <= pages[1]; page++) {
//     await pageVerses.push(getVersesBypage(page));
//     console.log(pageVerses);
//   }

//   console.log(verses);
//   return verses;
// };

const renderVerses = async function (id) {
  // Get pages
  const { chapter } = await getJson(
    `https://api.quran.com/api/v4/chapters/${id}`
  );
  console.log(chapter);
  const pages = chapter.pages;
  console.log(pages);

  // Get verses by page
  const verses = [];
  const versesByPage = [];
  for (let page = pages[0]; page <= pages[1]; page++) {
    getJson(
      `https://api.quran.com/api/v4/quran/verses/uthmani?page_number=${page}`
    )
      .then((res) => {
        const results = res.verses;
        results.forEach((el) => {
          verses.push(el.text_uthmani);
        });
      })
      .catch((e) => {
        console.error(e.message);
      });
    versesByPage.push(verses);
  }
  console.log(versesByPage);
  // const verses = await getChaperByID(id);
  // // console.log(verses);
  // verses.forEach((el, i) => {
  //   let html = `<div class="page-num">-الصفحة -${i + 1}</div>
  //               <div class="page--verses">${el}</div>`;
  //   if ((i + 1) % 2 !== 0) {
  //     surahPages.children[0].insertAdjacentHTML("beforeend", html);
  //   } else {
  //     surahPages.children[1].insertAdjacentHTML("beforeend", html);
  //   }

  //   // console.log(verse);
  // });
};

// get chapter's id after the surah's card has been clicked
// by reading the query string of the page's URL
const queryString = window.location.search;
const urlPrams = new URLSearchParams(queryString);
const chapterID = urlPrams.get("id");
console.log(chapterID);
renderVerses(chapterID);
// getChaperByID(20);
