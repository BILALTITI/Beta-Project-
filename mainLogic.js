function SetupUI(){
    const token = localStorage.getItem("token");
    const loginBtn = document.getElementById("logbtn");
    const logoutBtn = document.getElementById("logoutbtn");
    const RegesterBtn = document.getElementById("Regbtn");
    const Addpostbtn = document.getElementById("Add-btn");
    const userName = document.getElementById("Nav-user-name");
    const userimage = document.getElementById("Nav-user-image");
    const EditBtn = document.getElementById("editBtn");

    
    if (token == null) {
        // For non-logged-in user
        logoutBtn.style.display = "none";
         loginBtn.style.display = "block";
        RegesterBtn.style.display = "block";
       if(Addpostbtn!=null){

           Addpostbtn.style.display = "none";
      
        }
        userName.style.display = "none";
        userimage.style.display = "none";
    } else {
        // For logged-in user
        if(Addpostbtn!=null){

            Addpostbtn.style.display = "block";
        }
     
        logoutBtn.style.display = "block";
        loginBtn.style.display = "none";
        RegesterBtn.style.display = "none";

        const user = GetCurrentUser();
        userName.innerHTML = user.username;
        userimage.src = user.profile_image;

        // Force reflow for immediate update
        userName.offsetHeight;  // Trigger reflow for username
        userimage.offsetHeight;  // Trigger reflow for profile image

        userName.style.display = "block";
        userimage.style.display = "block"; 
    }
}
// Auth function

function loginBtnclicked(){
    const BaseUrl="https://tarmeezacademy.com/api/v1"
    const password = document.getElementById("Password").value;
    const UserName = document.getElementById("recipient-name").value;
    const token=""
        const Params={
        "username": UserName,
        "password":password
        }
  const url=`${BaseUrl}/login`
  toggleLoader(true)      
  axios.post(url,Params)
      .then((response)=>{


    localStorage.setItem("token", response.data.token)
    localStorage.setItem("Current_user",JSON.stringify( response.data.user))
    GetPosts()
    ShowAlert(' Login Success', 'Your operation was completed successfully!',"success");
    SetupUI()
    const modal = document.getElementById("loginmodal");
    const modalInstance = bootstrap.Modal.getInstance(modal);
    modalInstance.hide()

    }).catch((error) => {
            const message = error.response.data.message;
            ShowAlert("login Failed", message, "danger");
        }).finally(()=>{

            toggleLoader(false)
        })
} 


function GetCurrentUser(){
    let User =null
    const StorageUser=localStorage.getItem("Current_user")
    if (StorageUser!=null)
    {
    User =JSON.parse(StorageUser)
    }
    return User
}

function Logout(){
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    localStorage.removeItem("Current_user")
    ShowAlert('Logout successfully', 'Your operation was completed successfully!',"success");
    GetPosts()
    SetupUI()
}

function ShowAlert(title, message, type = 'success') {
    const toastLiveExample = document.getElementById('success-Alert');

    if (toastLiveExample) {
        // Update the title and message
        const titleElement = toastLiveExample.querySelector('.toast-title');
        titleElement.textContent = title;

        const messageElement = toastLiveExample.querySelector('.toast-body');
        messageElement.textContent = message;

        // Select the toast header to change its background color
        const headerElement = toastLiveExample.querySelector('.toast-header');

        // Define color classes for different alert types
        const colorClasses = {
            success: 'bg-success text-white',
            danger: 'bg-danger text-white',
            warning: 'bg-warning text-dark',
            info: 'bg-info text-white'
        };

        // Set default color if type is not recognized
        const colorClass = colorClasses[type] || colorClasses['success'];

        // Apply the color class to the header and body
        toastLiveExample.className = `toast ${colorClass} show fade`;
        headerElement.className = `toast-header ${colorClass}`;
        titleElement.className = `toast-title text-white`; // Ensure text remains visible

        // Show the toast
        const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLiveExample);
        toastBootstrap.show();
    }
}

 function RegisterBtnclicked()
{
    const BaseUrl="https://tarmeezacademy.com/api/v1"

const Name = document.getElementById("Register-name-input").value;
const password = document.getElementById("Register-Password-input").value;
const UserName = document.getElementById("Register-Username-input").value;
const image = document.getElementById("Register-image-input").files[0];

let formdata = new FormData()
formdata.append("username",UserName)
formdata.append("name",Name)
formdata.append("image",image)
formdata.append("password",password)

        
    const url = `${BaseUrl}/register`;
    toggleLoader(true)
        axios.post(url,formdata)
        .then((response) => {
                console.log(response)
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("Current_user", JSON.stringify(response.data.user));
        ShowAlert('Register Successfully', 'Your operation was completed successfully!', 'success');
        
        const modal = document.getElementById("Register-modal");
        const modalInstance = bootstrap.Modal.getInstance(modal);
        modalInstance.hide();
        
        SetupUI();
    }) .catch((error) => {
        const message = error.response.data.message;
        ShowAlert("Register Failed", message, "danger");
    }).finally(()=>{

        toggleLoader(false)
    })
}


// Auth function//

// posts Requests

function confirmDeletePost() { 
    const BaseUrl = "https://tarmeezacademy.com/api/v1";
    const postId = document.getElementById("delete-post-id-input").value;
    const url = `${BaseUrl}/posts/${postId}`;
  toggleLoader(true)
    let token = localStorage.getItem("token");
    axios.delete(url, {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    })
    .then((response) => {
         
        const modal = document.getElementById("Delete-post-modal");
        const modalInstance = bootstrap.Modal.getInstance(modal); // Capitalized "Modal"
        modalInstance.hide();
        ShowAlert('Delete Post successfully', 'Delete Post has been done successfully!', "success");
        GetPosts();
    })
    .catch((error) => {
        const message = error.response.data.message 
        ShowAlert("Delete Post Failed", message, "danger");
    }).finally(()=>{
        toggleLoader(false)
    })
}


  
 function editPostBtnClicked(postObj) {
    const post = JSON.parse(decodeURIComponent(postObj));
     // Decode the encoded string properly
    
     document.getElementById("postId-input").value = post.id;
     document.getElementById("post-title-modal2").innerHTML  = "Edit Post";
     document.getElementById("post-Modal-submit-btn2").innerHTML = "Update Post";
     document.getElementById("post-body").value = post.body;
     document.getElementById("Title-input").value = post.title;

    let postModal = new bootstrap.Modal(document.getElementById("create-post-modal"),{});
    postModal.toggle();

}
function addBtnClicked() {
    document.getElementById("postId-input").value = "";
    document.getElementById("post-title-modal2").innerHTML = "Create Post";
    document.getElementById("post-Modal-submit-btn").innerHTML = "Create Post";
    document.getElementById("post-body").value = "";
    document.getElementById("Title-input").value = "";
    
    
    let postModal = new bootstrap.Modal(document.getElementById("create-post-modal"), {});
    postModal.toggle();
    
    
}

function createNewPostBtnclicked() {
    const BaseUrl = "https://tarmeezacademy.com/api/v1"
    let postId = document.getElementById("postId-input").value;
    let isCreate = postId == null || postId == "";

    const title = document.getElementById("Title-input").value;
    const body = document.getElementById("post-body").value;
    const image = document.getElementById("post-image-input").files[0];
    let formdata = new FormData();
    formdata.append("body", body);
    formdata.append("title", title);
    formdata.append("image", image);

    const token = localStorage.getItem("token");
    const headers = {
        "authorization": `Bearer ${token}`
    };

    let url = "";
    if (isCreate) {
        url = `${BaseUrl}/posts`;
            toggleLoader(true)
        axios.post(url, formdata, { headers: headers })
            .then((response) => {
                ShowAlert('Create A New Post successfully', 'New Post Has Been Created successfully!', "success");
                GetPosts();
                const modal = document.getElementById("create-post-modal");
                const modalInstance = bootstrap.Modal.getInstance(modal);
                modalInstance.toggle();
           
            }).catch((error) => {
                const message = error.response.data.message;
                ShowAlert("Create A New Post Failed", message, "danger");
            }).finally(()=>{
                toggleLoader(false)
            })

        } else {
        formdata.append("_method", "put");
        url = `${BaseUrl}/posts/${postId}`;
        toggleLoader(true)
        axios.post(url, formdata, { headers: headers })
            .then((response) => {
                ShowAlert('Update Post successfully', 'Post Has Been Updated successfully!', "success");
                GetPosts();
                const modal = document.getElementById("create-post-modal");
                const modalInstance = bootstrap.Modal.getInstance(modal);
                modalInstance.hide();
            }).catch((error) => {
                const message = error.response.data.message;
                console.log(message);
                ShowAlert("Update Post Failed", message, "danger");
            }).finally(()=>{
                toggleLoader(false)
            })
        }
}

function postClick(postId) {
    window.location = `Postdetails.html?postId=${postId}`;
}
function DeletePostBtnClicked(postObj) { 
    const post = JSON.parse(decodeURIComponent(postObj)); 
    
    document.getElementById("delete-post-id-input").value=post.id
    let postModal = new bootstrap.Modal(document.getElementById("Delete-post-modal"),{});
    postModal.toggle();
    
    
}
function profileClicked(){
    const user= GetCurrentUser()
   const userId= user.id 
    
    window.location =`profile.html?userId=${userId}`
}
 // posts Requests//


// ======================== loader =================
function toggleLoader(show=true){
    if(show)
    {
        document.getElementById("loader").style.visibility='visible'
    }else{
        
        document.getElementById("loader").style.visibility='hidden'
    }

}

// ======================== //loader// =================
let output = document.getElementById('output');
function clearAllInputs(event) {
   var allInputs = document.querySelectorAll('input','textarea');
   let textarea=document.querySelector('textarea')
   allInputs.forEach(singleInput => singleInput.value = '');


   output.innerHTML += "Form submitted and cleared successfully! <br>";
}