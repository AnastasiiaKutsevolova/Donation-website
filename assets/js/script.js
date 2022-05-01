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

  const nameInputValue = document.getElementById("profile-name");
  const emailInputValue = document.getElementById("profile-email");

  const logoutBtn = document.getElementById("logout");

  const volunteerLoginContainer = document.getElementById(
    "become-volunteer-login"
  );
  const volunteerLoginBtn = document.getElementById("volunteer-login-btn");

  const getUser = JSON.parse(localStorage.getItem("user")) || {};
  //   Render Volunteers

  const getVolunteers = async () => {
    try {
      const res = await fetch("http://localhost:3003/volunteer");
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

    const { token } = JSON.parse(localStorage.getItem("user"));

    fetch("http://localhost:3003/volunteer", {
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

    fetch("http://localhost:3003/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: emailAddress,
        password: password,
      }),
    })
      .then((res) => res.json())
      .then((user) => {
        successLogin.style.display = "block";

        toggleAuthHeader(user);
        checkIfUserExist(user);

        localStorage.setItem("user", JSON.stringify(user));

        setTimeout(() => {
          loginModal.toggle();
          successLogin.style.display = "none";
        }, 1000);

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

    fetch("http://localhost:3003/signup", {
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
    const { user } = getUser;

    nameInputValue.value = user.name;
    emailInputValue.value = user.email;
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
});
