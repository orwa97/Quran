"use strict";

// SELECT ELEMENTS
const readingBar = document.querySelector(".header__reading-bar");
const topPage = document.querySelector(".page--top");
const surahPages = document.querySelector(".surah-contents");
const surahName = document.getElementById("surah-name");
const versesNum = document.getElementById("verses-num");

const barOffsetTop = readingBar.offsetTop;
const svgVerseSepUrl = "img/SVG/versese-separator.svg";
const makeItStick = function () {
  if (window.pageYOffset > barOffsetTop) {
    readingBar.classList.add("sticky");
  } else {
    readingBar.classList.remove("sticky");
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

const renderVerses = async function (id) {
  // Get pages
  const { chapter } = await getJson(
    `https://api.quran.com/api/v4/chapters/${id}`
  );
  const pages = chapter.pages;
  surahName.textContent = chapter.name_arabic;
  versesNum.textContent = `(${chapter.verses_count}-1) الآيات`;

  // Get verses by page
  const versesByPage = [];
  const verses = [];

  for (let page = pages[0]; page <= pages[1]; page++) {
    versesByPage.push(
      getJson(
        `https://api.quran.com/api/v4/quran/verses/uthmani?page_number=${page}`
      )
    );
  }
  let verseCount = 0;
  Promise.all(versesByPage).then((responses) => {
    responses.forEach((res, i) => {
      const versesHtml = [];
      res.verses.forEach((verse, j) => {
        const html = `${verse.text_uthmani}<span>( ${++verseCount} )</span>`;
        versesHtml.push(html);
      });
      const html = `<div class="surah-contents__page">
        <p class="page__verses">${versesHtml.join("")}</p>
        <div class="page__page-num"><span></span>
        -صفحة -${pages[0] + i}
        <span></span>
        </div>
      </div>`;
      surahPages.insertAdjacentHTML("beforeend", html);
    });
  });
  surahPages.insertAdjacentHTML(
    "afterbegin",
    "<p class=surah-contents__basmalah> بِسْمِ اللَّـهِ الرَّحْمَـٰنِ الرَّحِيمِ</p>"
  );
};

// get chapter's id after the surah's card has been clicked
// by reading the query string of the page's URL
const queryString = window.location.search;
const urlPrams = new URLSearchParams(queryString);
const chapterID = urlPrams.get("id");
renderVerses(chapterID);
