"use strict";

// select elements
const tapBtn = document.querySelector(".tap-btn");
const btnSurah = document.querySelector(".btn--surah");
const btnJuz = document.querySelector(".btn--juz");
const tapSurah = document.querySelector(".tap--surah");
const tapJuz = document.querySelector(".tap--juz");
const tap = document.querySelector(".tap");
const root = document.querySelector(":root");
let surahCard, juzSurahCard;

const clickedOnSurahCard = function () {
  // get all surahCards -->
  surahCard = document.querySelectorAll(".surah");
  surahCard.forEach((el) =>
    // THEN by clicking on any surahCard -->
    el.addEventListener("click", function () {
      // --> get it's ID
      let surahID = el.children[0].textContent;
      // --> relocat the user to the next page along with the surah's id
      window.location.href = `/surah.html?id=${surahID}`;
    })
  );
};

// GET JSON
const getJson = function (url) {
  return fetch(url).then((res) => res.json());
};

// GET & INSERT CHAPTERS DATA
const chaptersArray = [];
const getChapters = async function () {
  const { chapters } = await getJson("https://api.quran.com/api/v4/chapters");
  chapters.forEach((chapter) => {
    const div = document.createElement("div");
    div.classList.add("surah");
    let html = `<div class="surah__num">${chapter.id}</div>
              <div class="surah__name">
                <span class="name--eng">${chapter.name_simple}</span>
                <span class="name--ar">${chapter.name_arabic}</span>
              </div>`;
    div.insertAdjacentHTML("beforeend", html);
    tapSurah.appendChild(div);
    chaptersArray.push(chapter);
  });

  clickedOnSurahCard();
};

// GET & INSERT JUZS DATA
const getJuz = async function () {
  const { juzs } = await getJson("https://api.quran.com/api/v4/juzs");
  juzs.forEach((juz, i) => {
    let chaptersIdsVers = Object.entries(juz.verse_mapping);
    // ----------GET JUZ SURAHS
    const getSurah = function () {
      let html = "";
      chaptersIdsVers.forEach((curr, i) => {
        html += `<div class="surah">
                  <div class="surah__num">${curr[0]}</div>
                  <div class="surah__name">
                    <span class="name--eng">${
                      chaptersArray[curr[0] - 1].name_simple
                    }</span>
                    <span class="name--ar">${
                      chaptersArray[curr[0] - 1].name_arabic
                    }</span>
                  </div>
                  <div class="surah__verses">(${curr[1]})</div>
                </div>`;
      });
      return html;
    };
    let html = `<div class="juz">
    <div class="juz__num">${juz.id}</div>
              <div class="juz__surahs">
                ${getSurah()}
              </div>
            </div>`;
    tapJuz.insertAdjacentHTML("beforeend", html);
  });

  clickedOnSurahCard();

  const idsurah = chaptersArray.findIndex((el, i) => {});
};
getChapters();
getJuz();
const hideTap = function (show, hide) {
  if (show.classList.contains("tap-hidden")) {
    show.classList.remove("tap-hidden");
    hide.classList.add("tap-hidden");
  }
};
btnSurah.addEventListener("click", function () {
  hideTap(tapSurah, tapJuz);
  btnSurah.classList.add("btn-active");
  btnJuz.classList.remove("btn-active");
  root.style.setProperty("--pseudo-left", "0.1rem");
});
btnJuz.addEventListener("click", function () {
  hideTap(tapJuz, tapSurah);
  btnJuz.classList.add("btn-active");
  btnSurah.classList.remove("btn-active");
  root.style.setProperty("--pseudo-left", "6.2rem");
});
