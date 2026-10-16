const profiles = {
  franchise: {
    initials: "AR",
    name: "Alex R.",
    distance: "8 miles away",
    category: "FRANCHISE",
    location: "Pasadena, California",
    goal: "“I want to open a fast-casual franchise with the right local co-owner.”",
    brings: "$80,000 + store-management experience",
    needs: "Local marketing + $40,000",
    timeline: "Within 6 months",
    style: "A hands-on co-owner",
    reason: "You’re nearby, want the same kind of business, and bring different strengths."
  },
  startup: {
    initials: "JM",
    name: "Jordan M.",
    distance: "12 miles away",
    category: "STARTUP",
    location: "Culver City, California",
    goal: "“I built the first product and need a commercial cofounder who can help turn it into a business.”",
    brings: "Product design + engineering",
    needs: "Sales + partnership experience",
    timeline: "Ready now",
    style: "A full-time cofounder",
    reason: "Your commercial experience complements Jordan’s technical and product strengths."
  },
  local: {
    initials: "SK",
    name: "Sam K.",
    distance: "5 miles away",
    category: "LOCAL BUSINESS",
    location: "West Covina, California",
    goal: "“I found a promising location for a golf simulator franchise and want a local partner to build it with me.”",
    brings: "$120,000 + a potential location",
    needs: "$70,000 + customer growth",
    timeline: "Within 6–9 months",
    style: "An active local co-owner",
    reason: "You’re in the same area and bring the marketing skills and capital Sam is looking for."
  },
  podcast: {
    initials: "TC",
    name: "Taylor C.",
    distance: "18 miles away",
    category: "PODCAST",
    location: "Los Angeles, California",
    goal: "“I want to make a smart, approachable podcast about how AI is changing everyday work.”",
    brings: "Production + editing",
    needs: "Industry knowledge + a co-host",
    timeline: "Within 1–3 months",
    style: "A weekly creative partner",
    reason: "Your industry knowledge and communication style complement Taylor’s production experience."
  }
};

const fieldIds = {
  initials: "profile-avatar",
  name: "profile-name",
  distance: "profile-distance",
  category: "profile-category",
  location: "profile-location",
  goal: "profile-goal",
  brings: "profile-brings",
  needs: "profile-needs",
  timeline: "profile-timeline",
  style: "profile-style",
  reason: "profile-reason"
};

const card = document.querySelector("#profile-card");
const toast = document.querySelector("#toast");
let activeProfile = "franchise";

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => toast.classList.remove("show"), 2600);
}

function setActiveCategory(key) {
  document.querySelectorAll("[data-category]").forEach((button) => {
    button.classList.toggle("active", button.dataset.category === key);
  });
}

function renderProfile(key) {
  const data = profiles[key];
  if (!data || !card) return;
  card.classList.add("switching");
  window.setTimeout(() => {
    Object.entries(fieldIds).forEach(([property, id]) => {
      const element = document.getElementById(id);
      if (element) element.textContent = data[property];
    });
    activeProfile = key;
    setActiveCategory(key);
    card.classList.remove("switching");
  }, 170);
}

document.querySelectorAll("[data-category]").forEach((button) => {
  button.addEventListener("click", () => renderProfile(button.dataset.category));
});

document.querySelectorAll("[data-category-jump]").forEach((button) => {
  button.addEventListener("click", () => {
    renderProfile(button.dataset.categoryJump);
    document.querySelector("#discover").scrollIntoView({ behavior: "smooth" });
  });
});

document.querySelector("#pass-profile")?.addEventListener("click", () => {
  const keys = Object.keys(profiles);
  const next = keys[(keys.indexOf(activeProfile) + 1) % keys.length];
  card.classList.add("passed");
  window.setTimeout(() => {
    card.classList.remove("passed");
    renderProfile(next);
  }, 360);
  showToast("Passed. Here’s another possible match.");
});

document.querySelector("#interest-profile")?.addEventListener("click", () => {
  card.classList.add("accepted");
  window.setTimeout(() => card.classList.remove("accepted"), 550);
  showToast("Interested. A conversation opens if they choose you too.");
});

const profileModal = document.querySelector("#profile-modal");
const profileForm = document.querySelector("#profile-form");
let formStep = 1;

function showFormStep(step) {
  formStep = step;
  document.querySelector(".form-success").classList.remove("active");
  document.querySelectorAll(".form-step").forEach((section) => {
    section.classList.toggle("active", Number(section.dataset.step) === step);
  });
  document.querySelectorAll(".modal-progress span").forEach((bar, index) => {
    bar.classList.toggle("active", index < step);
  });
}

document.querySelectorAll("[data-open-profile]").forEach((button) => {
  button.addEventListener("click", () => {
    showFormStep(1);
    profileModal.showModal();
  });
});

document.querySelectorAll("[data-close-modal]").forEach((button) => {
  button.addEventListener("click", () => {
    const dialog = button.closest("dialog");
    if (dialog?.open) dialog.close("cancel");
  });
});

document.querySelectorAll(".modal-next").forEach((button) => {
  button.addEventListener("click", () => {
    if (formStep === 1 && !profileForm.querySelector('input[name="build"]:checked')) {
      showToast("Choose what you want to build first.");
      return;
    }
    showFormStep(Math.min(3, formStep + 1));
  });
});

document.querySelectorAll("[data-back]").forEach((button) => {
  button.addEventListener("click", () => showFormStep(Math.max(1, formStep - 1)));
});

profileForm.addEventListener("submit", (event) => {
  if (event.submitter?.dataset.finish !== undefined) {
    event.preventDefault();
    const city = profileForm.querySelector('input[name="city"]');
    const email = profileForm.querySelector('input[name="email"]');
    if (!city.checkValidity()) {
      city.reportValidity();
      return;
    }
    if (!email.checkValidity()) {
      email.reportValidity();
      return;
    }
    document.querySelectorAll(".form-step").forEach((section) => section.classList.remove("active"));
    document.querySelector(".form-success").classList.add("active");
  }
});

const trustModal = document.querySelector("#trust-modal");
document.querySelector("[data-open-trust]").addEventListener("click", () => trustModal.showModal());

[profileModal, trustModal].forEach((dialog) => {
  dialog.addEventListener("click", (event) => {
    const rect = dialog.getBoundingClientRect();
    const inside = event.clientX >= rect.left && event.clientX <= rect.right && event.clientY >= rect.top && event.clientY <= rect.bottom;
    if (!inside) dialog.close();
  });
});

const menuButton = document.querySelector(".menu-button");
const nav = document.querySelector("#primary-nav");
menuButton.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  menuButton.setAttribute("aria-expanded", String(open));
});
nav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    nav.classList.remove("open");
    menuButton.setAttribute("aria-expanded", "false");
  });
});

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in-view");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.11 });
  document.querySelectorAll(".reveal").forEach((element) => observer.observe(element));
} else {
  document.querySelectorAll(".reveal").forEach((element) => element.classList.add("in-view"));
}
