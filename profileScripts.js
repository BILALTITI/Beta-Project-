const BaseUrl = "https://tarmeezacademy.com/api/v1"
SetupUI()
getUser()
GetPosts()
function getCurrentUserId(){


    const urlParams= new URLSearchParams(window.location.search)
    const ID =  urlParams.get("userId")
    return ID
}
function getUser(){

    const id = getCurrentUserId()
    let url = `${BaseUrl}/users/${id}`;
    axios.get(url)
    .then((response) =>{
const user =response.data.data
       document.getElementById("main-info-email").innerHTML=user.email
       document.getElementById("main-info-name").innerHTML=user.name
       document.getElementById("main-info-user-name").innerHTML=user.username
       document.getElementById("profile-author-name").innerHTML=user.username
       document.getElementById("main-info-image").src=user.profile_image

       // posts & comments count
       document.getElementById("post-count").innerHTML=user.posts_count
       document.getElementById("comments-count").innerHTML=user.comments_count
    })
}
 
function GetPosts( ) {
    const id = getCurrentUserId()
    let url = `${BaseUrl}/users/${id}/posts`;
    axios.get(url)
        .then((response) => {


            const userPosts= response.data.data 
          
           
          
            let user = GetCurrentUser();  // Store user information

            document.getElementById("user-posts").innerHTML=""
            for (let post of userPosts) {
                let isMyPost = user != null && post.author.id == user.id;  
                let editBtncontent = ``;
                let deleteBtncontent = ``;
                if (isMyPost) {
                  
                    let postEncoded = encodeURIComponent(JSON.stringify(post)); // Safely encode the post object
                editBtncontent = `
                            <button id="editBtn" class="btn btn-secondary" style="float: right; margin-right: 10px; border-radius: 10px;" onclick="editPostBtnClicked('${postEncoded}')">Edit</button>
                    `;
                                    
                deleteBtncontent=`
                
                             <button id="DeleteBtn" class="btn btn-danger" style="float: right;margin-right: 5px; border-radius:10px; " onclick="DeletePostBtnClicked('${postEncoded.replace(/'/g, "\\'")}')">Delete</button>
                
                `
                }

                let content = `<div id="posts">
                    <div class="card shadow">
                        <div class="card-header">
                            <img src="${post.author.profile_image}" alt="" class="border-3" style="width: 40px;height: 40px; border-radius: 50%;">
                            <b>${post.author.username}</b>
                            ${editBtncontent}
                            ${deleteBtncontent}
                        </div>
                        <div class="card-body" onclick="postClick(${post.id})" style="cursor: pointer;">
                            <img src="${post.image}" alt="" class="w-100 h-50">
                            <h6 class="m-1" style="color: rgb(193,193,193);">${post.created_at}</h6>
                            <h5>${post.title}</h5>
                            <p>${post.body}</p>
                            <hr>
                            <div>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pen" viewBox="0 0 16 16">
                                    <path d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001m-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708z"/>
                                </svg>
                                <span>(${post.comments_count}) Comment</span>
                                <span id="posts-tags-${post.id}">
                                    <!-- Tags will be appended here -->
                                </span>
                            </div>
                        </div>
                    </div>
                </div>`;

                document.getElementById("user-posts").innerHTML += content;

                const CurrentPostTagsID = `posts-tags-${post.id}`;
                document.getElementById(CurrentPostTagsID).innerHTML = "";

                let TagsContent = ""; // Initialize before the loop
                for (let tag of post.tags) {
                    TagsContent += `<span id="posts-tags">
                        <button class="btn btn-sm rounded-5" style="margin-left: 10px;margin-right: 5px; background-color: gray;color: white;">
                            ${tag.name}
                        </button>
                    </span>`;
                }
                document.getElementById(CurrentPostTagsID).innerHTML += TagsContent;
            }
        }).catch(error => {
            const message = error.response.data.message;
            ShowAlert("Post Loaded Failed", message, "danger");
        });
        
}


function editPostBtnClicked(postObj) {
    const post = JSON.parse(decodeURIComponent(postObj));
     
     document.getElementById("postId-input").value = post.id;
     document.getElementById("post-title-modal2").innerHTML  = "Edit Post";
     document.getElementById("post-Modal-submit-btn2").innerHTML = "Update Post";
     document.getElementById("post-body").value = post.body;
     document.getElementById("Title-input").value = post.title;

        let postModal = new bootstrap.Modal(document.getElementById("create-post-modal"),{});
          postModal.toggle();

}
