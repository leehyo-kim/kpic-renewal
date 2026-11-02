const filter = document.querySelector(".search-filter");
const chipList = document.querySelector(".selected-chips");
const count = document.querySelector(".selected-count");

// 현재 HTML에 들어 있는 식별마크 예시
const selectedMark = filter.querySelector(".selected-mark");
let markSelected = Boolean(selectedMark);

// 조건 개수 변경을 보조기기에서도 알 수 있도록 설정
count.setAttribute("role", "status");
count.setAttribute("aria-atomic", "true");

// 선택한 조건을 화면에 표시
function updateConditions() {
  const conditions = [];

  // 1. 앞면 / 뒷면 식별문자
  const textFields = [
    {
      name: "front-mark",
      exactName: "front-exact",
      title: "앞면"
    },
    {
      name: "back-mark",
      exactName: "back-exact",
      title: "뒷면"
    }
  ];

  textFields.forEach(({ name, exactName, title }) => {
    const input = filter.elements.namedItem(name);
    const exact = filter.elements.namedItem(exactName);
    const value = input.value.trim();

    if (!value) return;

    conditions.push({
      text: `${title}: ${value}${exact.checked ? " (정확히 일치)" : ""}`,
      remove() {
        input.value = "";
        exact.checked = false;
        input.focus();
      }
    });
  });

  // 2. 현재 HTML에 있는 식별마크
  if (selectedMark && markSelected) {
    conditions.push({
      text: selectedMark.querySelector(".mark span").textContent.trim(),
      image: selectedMark.querySelector(".mark img").getAttribute("src"),
      remove() {
        markSelected = false;
        selectedMark.hidden = true;
        filter.querySelector(".mark-select-btn")?.focus();
      }
    });
  }

  // 3. 색상 / 모양 / 제형 / 분할선
  const selectedInputs = filter.querySelectorAll(
    'input[name="color"]:checked, ' +
    'input[name="shape"]:checked, ' +
    'input[name="form"]:checked, ' +
    'input[name="score"]:checked'
  );

  const groupNames = {
    color: "색상",
    shape: "모양",
    form: "제형",
    score: "분할선"
  };

  selectedInputs.forEach((input) => {
    const label = input.closest("label");

    // 각 선택 항목의 마지막 span이 이름
    const text = label.querySelector("span:last-child").textContent.trim();

    const condition = {
      text,
      description: `${groupNames[input.name]} ${text}`,
      remove() {
        input.checked = false;
        input.focus();
      }
    };

    if (input.name === "color") {
      condition.colorClass = label.querySelector(".color-circle").className;
    } else {
      const icon = label.querySelector(
        ".shape-active, .form-active, .score-active"
      );

      condition.image = icon?.getAttribute("src");
    }

    conditions.push(condition);
  });

  // 기존 칩을 비우고 현재 선택 상태로 다시 생성
  chipList.replaceChildren();

  conditions.forEach((condition) => {
    const chip = document.createElement("li");
    chip.className = "selected-chip";

    // 색상 원
    if (condition.colorClass) {
      const color = document.createElement("span");

      color.className = condition.colorClass;
      color.classList.remove("color-circle");
      color.classList.add("selected-color");
      color.setAttribute("aria-hidden", "true");

      chip.append(color);
    }

    // 모양 / 제형 / 분할선 / 식별마크 이미지
    if (condition.image) {
      const icon = document.createElement("img");

      icon.src = condition.image;
      icon.alt = "";
      icon.className = "selected-icon";

      chip.append(icon);
    }

    // 조건 이름
    const text = document.createElement("span");
    text.textContent = condition.text;
    chip.append(text);

    // 삭제 버튼
    const removeButton = document.createElement("button");

    removeButton.type = "button";
    removeButton.className = "chip-remove";
    removeButton.setAttribute(
      "aria-label",
      `${condition.description || condition.text} 조건 삭제`
    );

    const removeIcon = document.createElement("img");
    removeIcon.src = "./img/x.svg";
    removeIcon.alt = "";

    removeButton.append(removeIcon);

    removeButton.addEventListener("click", () => {
      condition.remove();
      updateConditions();
    });

    chip.append(removeButton);
    chipList.append(chip);
  });

  // 숫자 업데이트
  count.textContent = conditions.length;
  count.setAttribute(
    "aria-label",
    `선택한 조건 ${conditions.length}개`
  );
}

// 식별문자는 입력하는 즉시 반영
filter.addEventListener("input", (event) => {
  if (event.target.matches('input[type="text"]')) {
    updateConditions();
  }
});

// 체크박스 / 라디오 선택 시 반영
filter.addEventListener("change", updateConditions);

// 식별마크 옆 × 버튼
selectedMark?.querySelector("button").addEventListener("click", () => {
  markSelected = false;
  selectedMark.hidden = true;

  filter.querySelector(".mark-select-btn")?.focus();
  updateConditions();
});

// 선택 초기화
filter.addEventListener("reset", () => {
  // 브라우저가 기본 초기화를 완료한 다음 실행
  setTimeout(() => {
    filter.querySelectorAll('input[type="text"]').forEach((input) => {
      input.value = "";
    });

    filter.querySelectorAll(
      'input[type="checkbox"], input[type="radio"]'
    ).forEach((input) => {
      input.checked = false;
    });

    markSelected = false;

    if (selectedMark) {
      selectedMark.hidden = true;
    }

    updateConditions();
  }, 0);
});

// 검색 결과 연결 전에는 폼 제출로 새로고침되지 않도록
filter.addEventListener("submit", (event) => {
  event.preventDefault();
});

// 처음 화면에도 현재 선택 상태 반영
updateConditions();