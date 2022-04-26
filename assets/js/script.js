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

  //   Render Volunteers

  const getVolunteers = async () => {
    try {
      const res = await fetch("http://localhost:3003/volunteer");
      const volunteers = await res.json();

      return volunteers;
    } catch (error) {
      console.error(error);
    }
  };

  const renderVolunteersList = async () => {
    const { volunteers } = await getVolunteers();

    const formatData = (date) => date.split("T")[0];

    console.log(volunteers.sort((a, b) => b.createdAt - a.createdAt));

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
                      <div
                        class="d-flex  justify-content-between align-items-center"
                      >
                        <h5 class="card-title">${volunteer.name}</h5>
                        <div class="d-flex flex-column justify-content-between align-items-center">
                        <span class="fw-lighter date mb-2">Created: ${formatData(
                          volunteer.createdAt
                        )}</span>
                            <div class="btn btn-primary"><a href="mailto:${
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

    fetch("http://localhost:3003/volunteer", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
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

  loginPopup.addEventListener("click", () => {
    const modal = document.getElementById("login-modal");
    console.log("click");
    loginModal.toggle();
    modal.style.display = "block";
  });

  signupPopup.addEventListener("click", () => {
    const modal = document.getElementById("signup-modal");
    console.log("click");
    signupModal.toggle();
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
    }).then((res) => {
      successLogin.style.display = "block";
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
    }).then((res) => {
      successSignup.style.display = "block";
      setTimeout(() => {
        signupModal.toggle();
        successSignup.style.display = "none";
      }, 1000);

      signupForm.reset();
    });
  });
});
