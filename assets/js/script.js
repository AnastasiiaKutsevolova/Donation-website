const BASE_URL = "http://localhost:3003";

document.addEventListener("DOMContentLoaded", function (event) {
  const volunteerForm = document.getElementById("volunteer-form");
  const volunteersList = document.getElementById("list-volunteer");

  const validationVolunteer = document.querySelector(".invalid-volunteer-form");
  const successVolunteer = document.querySelector(".valid-volunteer-form");

  const validationLogin = document.querySelector(".invalid-login-input");
  const successLogin = document.querySelector(".valid-login-input");

  const validationSignup = document.querySelector(".invalid-signup-input");
  const successSignup = document.querySelector(".valid-signup-input");

  const loginPopup = document.getElementById("login-popup");
  const loginForm = document.getElementById("login-form");

  const signupPopup = document.getElementById("signup-popup");
  const signupForm = document.getElementById("signup-form");

  const authHeader = document.getElementById("user-auth-section");
  const profileHeader = document.getElementById("user-profile-section");
  const profileLink = document.getElementById("user-auth-link");

  const watchPopup = document.getElementById("watch-video");
  // const profilePopup = document.getElementById("profile-modal");

  const profileNameInput = document.getElementById("profile-name");

  // const updateInfoBtn = document.querySelector(".update-btn");

  const profileInfoForm = document.getElementById("profile-info-form");

  const logoutBtn = document.getElementById("logout");

  const volunteerLoginContainer = document.getElementById(
    "become-volunteer-login"
  );
  const volunteerLoginBtn = document.getElementById("volunteer-login-btn");

  const getUser = JSON.parse(localStorage.getItem("user")) || {};

  const sections = document.querySelectorAll("section");
  const navLi = document.querySelectorAll("nav ul li");

  const profileAlert = document.querySelector(".profile-alert");
  const profileSuccess = document.querySelector(".profile-success");

  const loginAlert = document.querySelector(".login-alert");

  const deleteBtn = document.querySelector(".delete-btn");

  const sanitizedObj = (obj) =>
    Object.keys(obj).reduce(
      (acc, key) => (obj[key] ? { ...acc, [key]: obj[key] } : acc),
      {}
    );

  const getToken = () => JSON.parse(localStorage.getItem("user"));

  window.addEventListener("scroll", () => {
    let current = "";

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;

      if (scrollY >= sectionTop - sectionHeight / 3) {
        current = section.getAttribute("id");
      }
    });

    navLi.forEach((li) => {
      li.classList.remove("active");
      li.childNodes[1].classList.remove("active");

      if (li.classList.contains(current)) {
        li.classList.add("active");
        li.childNodes[1].classList.add("active");
      }
    });
  });

  //   Render Volunteers

  const getVolunteers = async () => {
    try {
      const res = await fetch(`${BASE_URL}/volunteer`);
      return res.json();
    } catch (error) {
      console.error(error);
    }
  };

  const checkIfUserExist = (user) => {
    return !!user.token
      ? ((volunteerForm.style.display = "block"),
        (volunteerLoginContainer.style.display = "none"))
      : ((volunteerForm.style.display = "none"),
        (volunteerLoginContainer.style.display = "block"));
  };

  const toggleAuthHeader = (user = {}) => {
    return !!user.token
      ? ((authHeader.style.display = "none"),
        (profileHeader.style.display = "block"))
      : ((authHeader.style.display = "block"),
        (profileHeader.style.display = "none"));
  };

  checkIfUserExist(getUser);
  toggleAuthHeader(getUser);

  const renderVolunteersList = async () => {
    const { volunteers } = await getVolunteers();

    const formatData = (date) => date.split("T")[0];

    return volunteers
      .reverse()
      .map(
        (volunteer) =>
          `
            <li>
                <div
                    class="card mb-4"
                    style="background-color: rgb(38, 38, 38)"
                  >
                    <div class="card-body border rounded">
                      <div class="d-flex  justify-content-between align-items-center">
                        <h5 class="card-title">${volunteer.name}</h5>
                        <div class="d-flex flex-column justify-content-between align-items-center">
                        <span class="fw-lighter date mb-2">Created: ${formatData(
                          volunteer.createdAt
                        )}</span>
                            <div class="border px-4 py-2 rounded"><a href="mailto:${
                              volunteer.email
                            }">Contact</a></div>
                      </div>   
                    </div>

                      <p class="mt-3">
                       ${volunteer.about}
                      </p>
                    </div>
                  </div>
                </li>
        `
      )
      .join("");
  };

  renderVolunteersList().then((data) => (volunteersList.innerHTML = data));

  //   Handle VOLUNTEER form submission

  volunteerForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const emailAddress = volunteerForm.elements["email"].value;
    const fullName = volunteerForm.elements["name"].value;
    const aboutMe = volunteerForm.elements["about"].value;

    if (emailAddress === "" || fullName === "" || aboutMe === "") {
      validationVolunteer.style.display = "block";
      return;
    } else {
      validationVolunteer.style.display = "none";
    }

    const { token } = getToken();

    fetch(`${BASE_URL}/volunteer`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name: fullName,
        email: emailAddress,
        about: aboutMe,
      }),
    }).then((res) => {
      successVolunteer.style.display = "block";

      setTimeout(() => {
        successVolunteer.style.display = "none";
      }, 1000);

      volunteerForm.reset();

      window.location.reload();
    });
  });

  // Login Form

  const loginModal = new bootstrap.Modal(
    document.getElementById("login-modal"),
    {}
  );
  const signupModal = new bootstrap.Modal(
    document.getElementById("signup-modal"),
    {}
  );

  const videoModal = new bootstrap.Modal(
    document.getElementById("video-modal")
  );

  const profileModal = new bootstrap.Modal(
    document.getElementById("profile-modal")
  );

  loginPopup.addEventListener("click", () => {
    const modal = document.getElementById("login-modal");
    loginModal.toggle();
    modal.style.display = "block";
  });

  signupPopup.addEventListener("click", () => {
    const modal = document.getElementById("signup-modal");
    signupModal.toggle();
    modal.style.display = "block";
  });

  profileLink.addEventListener("click", () => {
    const modal = document.getElementById("profile-modal");
    profileModal.toggle();

    modal.style.display = "block";

    displayUserProfileInfo();
  });

  //Watch Popup

  watchPopup.addEventListener("click", () => {
    const modal = document.getElementById("video-modal");
    videoModal.toggle();
    modal.style.display = "block";
  });

  //   Handle LOGIN form submission

  loginForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const emailAddress = loginForm.elements["email"].value;
    const password = loginForm.elements["password"].value;

    if (emailAddress === "" || password === "") {
      validationLogin.style.display = "block";
      return;
    } else {
      validationLogin.style.display = "none";
    }

    fetch(`${BASE_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: emailAddress,
        password: password,
      }),
    })
      .then((res) => res.json())
      .then(({ token, user, message }) => {
        if (!user) {
          loginAlert.style.display = "block";

          loginAlert.innerText = message;
        } else {
          loginAlert.style.display = "none";
          successLogin.style.display = "block";
          console.log(user);
          toggleAuthHeader({ token });
          checkIfUserExist({ token });

          localStorage.setItem("user", JSON.stringify(user));

          setTimeout(() => {
            loginModal.toggle();
            successLogin.style.display = "none";
          }, 1000);
        }

        loginForm.reset();
      });
  });

  // Handle Signup form

  signupForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const fullName = signupForm.elements["name"].value;
    const emailAddress = signupForm.elements["email"].value;
    const password = signupForm.elements["password"].value;

    if (fullName === "" || emailAddress === "" || password === "") {
      validationSignup.style.display = "block";
      return;
    } else {
      validationSignup.style.display = "none";
    }

    fetch(`${BASE_URL}/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: fullName,
        email: emailAddress,
        password: password,
      }),
    })
      .then((res) => res.json())
      .then(({ user }) => {
        successSignup.style.display = "block";

        toggleAuthHeader(user);
        checkIfUserExist(user);

        localStorage.setItem("user", JSON.stringify(user));

        setTimeout(() => {
          signupModal.toggle();
          successSignup.style.display = "none";
        }, 1000);

        signupForm.reset();
      });
  });

  function displayUserProfileInfo() {
    const { token } = getToken();

    fetch(`${BASE_URL}/user`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then(({ user }) => {
        profileNameInput.value = user.name;
      });
  }

  logoutBtn.addEventListener("click", () => {
    localStorage.clear();

    toggleAuthHeader({});
    checkIfUserExist({});
  });

  volunteerLoginBtn.addEventListener("click", () => {
    const modal = document.getElementById("signup-modal");
    signupModal.toggle();
    modal.style.display = "block";
  });

  //Update User Profile

  profileInfoForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const name = profileInfoForm.elements["name"].value;
    const password = profileInfoForm.elements["password"].value;

    const updatedValues = sanitizedObj({ name, password });

    if (Object.keys(updatedValues).length === 0) {
      //display validation error
      profileAlert.style.display = "block";

      setTimeout(() => {
        profileAlert.style.display = "none";
      }, 2000);

      return;
    }

    const { token } = getToken();

    fetch(`${BASE_URL}/user`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updatedValues),
    })
      .then((res) => res.json())
      .then(() => {
        profileSuccess.style.display = "block";

        displayUserProfileInfo();

        setTimeout(() => {
          profileSuccess.style.display = "none";
        }, 2000);
      });
  });

  //Delete User
  deleteBtn.addEventListener("click", () => {
    const confirmation = confirm(
      "Are you sure you want to Delete your profile?"
    );
    const { token } = getToken();

    if (confirmation) {
      fetch(`${BASE_URL}/user`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      }).then(() => {
        localStorage.removeItem("user");
        window.location.reload();
      });
    }
  });
});
