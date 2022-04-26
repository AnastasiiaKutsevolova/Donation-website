document.addEventListener("DOMContentLoaded", function (event) {
  const volunteerForm = document.getElementById("volunteer-form");
  const validation = document.querySelector(".invalid-feedback");
  const success = document.querySelector(".valid-feedback");
  const volunteersList = document.getElementById("list-volunteer");
  const loginPopup = document.getElementById("login-popup");
  const loginForm = document.getElementById("login-form");

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
                    <div class="card-body">
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
      validation.style.display = "block";
      return;
    } else {
      validation.style.display = "none";
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
      success.style.display = "block";

      setTimeout(() => {
        success.style.display = "none";
      }, 1000);

      volunteerForm.reset();
    });
  });

  // Login Form

  const myModal = new bootstrap.Modal(document.getElementById("modal"), {});

  loginPopup.addEventListener("click", () => {
    const modal = document.querySelector(".modal");
    console.log("click");
    myModal.toggle();
    modal.style.display = "block";
  });

  //   Handle LOGIN form submission

  loginForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const emailAddress = loginForm.elements["email"].value;
    const password = loginForm.elements["password"].value;

    if (emailAddress === "" || password === "") {
      validation.style.display = "block";
      return;
    } else {
      validation.style.display = "none";
    }

    fetch("http://localhost:3003/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: emailAddress,
        password: password,
      }),
    }).then((res) => {
      success.style.display = "block";

      setTimeout(() => {
        success.style.display = "none";
      }, 1000);

      loginForm.reset();
    });
  });
});
