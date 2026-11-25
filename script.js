const SOURCE = "https://www.nuscholarship.nu.ac.th/";
const LIST = "https://www.nuscholarship.nu.ac.th/page-table2/";
const EXCHANGE = "https://www.nuscholarship.nu.ac.th/student-exchange/";
const CONFERENCE = "https://www.nuscholarship.nu.ac.th/academic-conference/";

/* ข้อมูลประกาศ — เพิ่ม/แก้ไขรายการได้ที่นี่ (cat ต้องตรงกับ key ใน labels) */
const data = [
  {title: "ทุนวิจัยวิทยานิพนธ์ ประจำปีงบประมาณ 2569", cat: "research", desc: "ทุนสนับสนุนการทำวิจัยวิทยานิพนธ์สำหรับนิสิตระดับบัณฑิตศึกษา มีประกาศรับสมัครและประกาศผลแยกตามรอบ", tags: ["ทุนวิทยานิพนธ์", "บัณฑิตศึกษา", "ปี 2569"], status: "ข้อมูลประกาศ", url: LIST},
  {title: "ทุนสนับสนุนการศึกษาตลอดหลักสูตรสำหรับนิสิตศักยภาพสูง", cat: "scholarship", desc: "ทุนสนับสนุนการศึกษาระดับบัณฑิตศึกษาตลอดหลักสูตร ตามหลักเกณฑ์และเงื่อนไขที่มหาวิทยาลัยกำหนด", tags: ["ทุนการศึกษา", "ศักยภาพสูง"], status: "ตรวจสอบประกาศ", url: LIST},
  {title: "ทุนเผยแพร่และนำเสนอผลงานวิจัยในการประชุมวิชาการระดับนานาชาติ", cat: "conference", desc: "สนับสนุนการเผยแพร่หรือนำเสนอผลงานวิจัยของนิสิตระดับบัณฑิตศึกษา ตามเกณฑ์ของทุน", tags: ["ประชุมวิชาการ", "ผลงานวิจัย"], status: "ตรวจสอบประกาศ", url: LIST},
  {title: "โครงการแลกเปลี่ยนนิสิตระยะยาว ขาเข้า (Inbound)", cat: "exchange", desc: "โครงการแลกเปลี่ยนนิสิตจากสถาบันต่างประเทศ มีขั้นตอนเสนอและติดตามโครงการผ่านระบบ", tags: ["Inbound", "แลกเปลี่ยน", "3–4 เดือน"], status: "โครงการ", url: SOURCE},
  {title: "โครงการแลกเปลี่ยนนิสิตระยะยาว ขาออก (Outbound)", cat: "exchange", desc: "ข้อมูลโอกาสสำหรับนิสิตมหาวิทยาลัยนเรศวรไปแลกเปลี่ยน ณ สถาบันพันธมิตรต่างประเทศ", tags: ["Outbound", "แลกเปลี่ยน"], status: "โครงการ", url: SOURCE},
  {title: "ประกาศรายชื่อผู้ได้รับทุนวิจัยวิทยานิพนธ์ รอบที่ 1 และ 2", cat: "announcement", desc: "ตรวจสอบประกาศรายชื่อและรายละเอียดการดำเนินการหลังได้รับทุนจากหน้าแหล่งข้อมูล", tags: ["ประกาศผล", "ปี 2569"], status: "ประกาศผล", url: LIST},
  {title: "แบบฟอร์มสมัครทุนและเอกสารประกอบ", cat: "documents", desc: "รวมจุดเข้าถึงแบบฟอร์มสมัครทุน แบบฟอร์มสรุปโครงร่างวิทยานิพนธ์ และเอกสารประกอบ", tags: ["แบบฟอร์ม", "ดาวน์โหลด"], status: "เอกสาร", url: LIST},
  {title: "แหล่งทุนภายในและแหล่งทุนภายนอก", cat: "scholarship", desc: "ค้นหาข่าวทุนจากหน่วยงานภายในมหาวิทยาลัยและหน่วยงานผู้ให้ทุนภายนอก", tags: ["ทุนภายใน", "ทุนภายนอก"], status: "รวมแหล่งทุน", url: SOURCE}
];

data.filter(item => item.cat === "exchange").forEach(item => { item.url = EXCHANGE; });
data.filter(item => item.cat === "conference").forEach(item => { item.url = CONFERENCE; });

const labels = {
  scholarship: "ทุนการศึกษา",
  research: "ทุนวิจัย",
  conference: "ประชุมวิชาการ",
  exchange: "แลกเปลี่ยนนิสิต",
  announcement: "ข่าวและประกาศ",
  documents: "เอกสาร"
};

const ICON = '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M6 3H3v10h10v-3M9 3h4v4M13 3L7 9"/></svg>';

let active = "all";
const $ = id => document.getElementById(id);
const cards = $("cards"), search = $("searchInput"), filters = $("filters");
const esc = s => String(s).replace(/[&<>"']/g, c => ({"&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"}[c]));

function matchesQuery(x, q) {
  return !q || (x.title + " " + x.desc + " " + x.tags.join(" ") + " " + labels[x.cat]).toLowerCase().includes(q);
}

function renderFilters() {
  const q = search.value.trim().toLowerCase();
  const count = c => data.filter(x => (c === "all" || x.cat === c) && matchesQuery(x, q)).length;
  const items = [["all", "ทั้งหมด"], ...Object.entries(labels)];
  filters.innerHTML = items.map(([key, name]) =>
    `<button class="filter-btn" type="button" data-filter="${key}" aria-pressed="${key === active}">${name}<span>${count(key)}</span></button>`
  ).join("");
}

function render() {
  const q = search.value.trim().toLowerCase();
  const rows = data.filter(x => (active === "all" || x.cat === active) && matchesQuery(x, q));

  cards.innerHTML = rows.length ? rows.map(x => `
    <article class="row">
      <div>
        <div class="row-cat">${esc(labels[x.cat])}</div>
        <h3>${esc(x.title)}</h3>
        <p>${esc(x.desc)}</p>
        <div class="row-tags">${x.tags.map(t => `<span>${esc(t)}</span>`).join("")}<span class="status">${esc(x.status)}</span></div>
      </div>
      <div class="row-actions">
        <a class="btn-open" href="${esc(x.url)}" target="_blank" rel="noopener">เปิดประกาศ ${ICON}</a>
        <button class="btn-copy" type="button" data-copy="${esc(x.url)}">คัดลอกลิงก์</button>
      </div>
    </article>`).join("")
    : `<div class="empty"><strong>ไม่พบรายการที่ตรงกับคำค้น</strong>ลองใช้คำอื่น หรือเลือกหมวด “ทั้งหมด”</div>`;

  $("listTitle").textContent = active === "all" ? "ประกาศล่าสุด" : labels[active];
  $("resultCount").textContent = `${rows.length} รายการ`;
  renderFilters();
  document.querySelectorAll(".main-nav a").forEach(a => a.classList.toggle("active", a.dataset.cat === active));
}

function setCategory(c, scroll) {
  active = c;
  render();
  if (scroll) $("list").scrollIntoView({behavior: "smooth", block: "start"});
}

filters.addEventListener("click", e => {
  const b = e.target.closest("[data-filter]");
  if (b) setCategory(b.dataset.filter, false);
});

document.querySelectorAll(".main-nav a").forEach(a => a.addEventListener("click", e => {
  e.preventDefault();
  setCategory(a.dataset.cat, true);
  $("mainNav").classList.remove("show");
  $("menuBtn").setAttribute("aria-expanded", "false");
}));

$("menuBtn").addEventListener("click", () => {
  const open = $("mainNav").classList.toggle("show");
  $("menuBtn").setAttribute("aria-expanded", String(open));
});

search.addEventListener("input", render);
$("heroSearch").addEventListener("submit", e => {
  e.preventDefault();
  $("list").scrollIntoView({behavior: "smooth", block: "start"});
});

cards.addEventListener("click", e => {
  const b = e.target.closest("[data-copy]");
  if (!b) return;
  const url = b.dataset.copy;
  (navigator.clipboard ? navigator.clipboard.writeText(url) : Promise.reject())
    .then(() => toast("คัดลอกลิงก์แล้ว"))
    .catch(() => toast("คัดลอกไม่สำเร็จ ลิงก์: " + url));
});

let toastTimer;
function toast(msg) {
  const t = $("toast");
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove("show"), 2400);
}

render();

const carousel = document.querySelector(".research-carousel");
if (carousel) {
  const slides = [...carousel.querySelectorAll(".research-slide")];
  const dots = [...carousel.querySelectorAll(".carousel-dot")];
  let slideIndex = 0;
  let slideTimer;

  function showSlide(index) {
    slideIndex = (index + slides.length) % slides.length;
    slides.forEach((slide, i) => {
      const activeSlide = i === slideIndex;
      slide.classList.toggle("is-active", activeSlide);
      slide.setAttribute("aria-hidden", String(!activeSlide));
      slide.tabIndex = activeSlide ? 0 : -1;
      slide.style.transform = `translateX(${(i - slideIndex) * 100}%)`;
      dots[i].classList.toggle("is-active", activeSlide);
      dots[i].setAttribute("aria-pressed", String(activeSlide));
    });
  }

  function stopSlideTimer() { clearInterval(slideTimer); }
  function startSlideTimer() {
    stopSlideTimer();
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      slideTimer = setInterval(() => showSlide(slideIndex + 1), 6500);
    }
  }

  carousel.querySelector(".carousel-prev").addEventListener("click", () => { showSlide(slideIndex - 1); startSlideTimer(); });
  carousel.querySelector(".carousel-next").addEventListener("click", () => { showSlide(slideIndex + 1); startSlideTimer(); });
  dots.forEach((dot, i) => dot.addEventListener("click", () => { showSlide(i); startSlideTimer(); }));
  carousel.addEventListener("mouseenter", stopSlideTimer);
  carousel.addEventListener("mouseleave", startSlideTimer);
  carousel.addEventListener("focusin", stopSlideTimer);
  carousel.addEventListener("focusout", event => {
    if (!carousel.contains(event.relatedTarget)) startSlideTimer();
  });
  showSlide(0);
  startSlideTimer();
}
