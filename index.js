let IP = "106.76.95.183";
let postOffices;
document.addEventListener("DOMContentLoaded", () => {
  $.getJSON(
    "https://ipinfo.io",
    function (response) {
      if (response.ip) IP = response.ip;
      $("#right_container span").html(IP);
    },
    "jsonp"
  );
});

const getStartedSection = document.getElementById("get_started_section");
const mainSection = document.getElementById("main_section");
document.getElementById("get_started_btn").addEventListener("click", () => {
  getStartedSection.style.display = "none";
  mainSection.style.display = "block";
  getInfo();
});

async function getInfo() {
  try {
    const response = await fetch(` https://ipapi.co/${IP}/json/`);
    const res = await response.json();

    console.log(res);
    showUserDetails(res);
    showLocationOnMap(res);
    const postOfficeData = await fetchPostOffices(res.postal);
    showMoreInfo(res, postOfficeData[0].Message);
    showPostOffices(postOfficeData[0].PostOffice);
  } catch (error) {
    console.log("Error fetching ipapi", error);
  }
}

function showUserDetails(data) {
  document.getElementById("user_details").innerHTML = `
    <p>IP Address : ${data.ip}</p>
    <div>
        <div>
            <p>Lat : ${data.latitude}</p>
            <p>Long : ${data.longitude}</p>
        </div>
        <div>
            <p>City : ${data.city}</p>
            <p>Region : ${data.region}</p>
        </div>
        <div>
            <p>Organisation : ${data.org}</p>
            <p>Hostname : ${data.hostname}</p>
        </div>
    </div>
    `;
}

function showLocationOnMap(data) {
  document.getElementById("map_container").innerHTML += `
  
    <iframe src="https://maps.google.com/maps?q=${data.latitude}, ${data.longitude}&z=15&output=embed"
    width="90%"
    height="85%"
    frameborder="0"
    style="border:0">
    </iframe> 

  `;
}

function showMoreInfo(data, message) {
  let myCurrentTime = new Date().toLocaleString(`en-${data.country_code}`, {
    timeZone: data.timezone,
  });
  document.getElementById("more_info").innerHTML += `
    <div>
        <p>Time Zone: ${data.timezone}</p>
        <p>Date And Time: ${myCurrentTime}</p>
        <p>Pincode: ${data.postal}</p>
        <p>Message:<span> ${message}</span></p>
    </div>
    `;
}

async function fetchPostOffices(pincode) {
  const res = await fetch(` https://api.postalpincode.in/pincode/${pincode}`);
  const response = await res.json();
  console.log(response);
  return response;
}

function showPostOffices(data) {
  postOffices = data;
  console.log(postOffices);
  const postOfficeContainer = document.getElementById("post_offices");
  postOffices.map((postOffice) => {
    postOfficeContainer.innerHTML += `
            <div class="post_office">
                <p>Name : ${postOffice.Name}</p>
                <p>Branch Type : ${postOffice.Branch}</p>
                <p>Delivery Status : ${postOffice.DeliveryStatus}</p>
                <p>District : ${postOffice.District}</p>
                <p>Division : ${postOffice.Division}</p>
            </div>
        `;
  });
}
