 currentPage = 1
 lastPage = 1

//===== INFINITE SCROLL =======//
window.addEventListener("scroll", function(){
    
    const endOfPage = window.innerHeight + window.window.scrollY >= document.body.scrollHeight;
    
    console.log(window.innerHeight, window.window.scrollY, document.body.scrollHeight)
    // console.log(currentPage, lastPage)
    if(endOfPage && currentPage < lastPage)
    {
        currentPage = currentPage + 1
        GetPosts(false, currentPage)
        
    }

});
SetupUI()
//=====// INFINITE SCROLL //=======//
 GetPosts()
    // =========== infinite scroll============//
     function userOnClicked(userId){
 window.location =`profile.html?userId=${userId}`
 
    }
    function GetPosts(reload = true, Page = 1) {
        toggleLoader(true);
    
        const BaseUrl = "https://tarmeezacademy.com/api/v1";
        let url = `${BaseUrl}/posts?limit=10&page=${Page}`;
        axios.get(url)
            .then((response) => {
                let posts = response.data.data;
                lastPage = response.data.meta.last_page;
                if (reload) {
                    document.getElementById("posts").innerHTML = ""; // Clear posts container if reloading
                }
    
                let user = GetCurrentUser();  // Fetch user once for consistency
                if (user) console.log("User ID:", user.id); // Debug current user ID
    
                for (let post of posts) {
                    let isMyPost = user != null && post.author.id === user.id;

                    let editBtncontent = ``;
                    let deleteBtncontent = ``;
    
    
                    let postEncoded = encodeURIComponent(JSON.stringify(post));
                    if (isMyPost) {
                        editBtncontent = `
                            <button id="editBtn" class="btn btn-secondary" style="float: right; margin-right: 10px; border-radius: 10px;" onclick="editPostBtnClicked('${postEncoded}')">Edit</button>
                        `;
                        deleteBtncontent = `
                            <button id="DeleteBtn" class="btn btn-danger" style="float: right; margin-right: 5px; border-radius:10px;" onclick="DeletePostBtnClicked('${postEncoded}')">Delete</button>
                        `;
                    }
    
                    let content = `
                        <div class="card shadow" style="margin-bottom: 15px;">
                            <div class="card-header">
                                <span onclick="userOnClicked(${post.author.id})" style="cursor: pointer;">
                                    <img src="${post.author.profile_image}" alt="" class="border-3" style="width: 40px;height: 40px; border-radius: 50%;">
                                    <b>${post.author.username}</b>
                                </span>
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
                                        <path d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0.5 0 1-.233-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001m-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708z"/>
                                    </svg>
                                    <span>(${post.comments_count}) Comment</span>
                                    <span id="posts-tags-${post.id}">
                                        <!-- Tags will be appended here -->
                                    </span>
                                </div>
                            </div>
                        </div>
                    `;
    
                    document.getElementById("posts").innerHTML += content;
    
                    const CurrentPostTagsID = `posts-tags-${post.id}`;
                    document.getElementById(CurrentPostTagsID).innerHTML = "";
    
                    let TagsContent = "";
                    for (let tag of post.tags) {
                        TagsContent += `<span id="posts-tags">
                            <button class="btn btn-sm rounded-5" style="margin-left: 50px;margin-right: 5px; background-color: gray;color: white;">
                                ${tag.name}
                            </button>
                        </span>`;
                    }
                    document.getElementById(CurrentPostTagsID).innerHTML += TagsContent;
                }
            })
            .catch(error => {
                const message = error.response.data.message;
                ShowAlert("Post Load Failed", message, "danger");
            })
            .finally(() => {
                toggleLoader(false);
            });
    }
    

    
  
function closeModal() {
    const modal = document.getElementById("create-post-modal");
    const modalInstance = bootstrap.Modal.getInstance(modal);
    modalInstance.hide();
    
    // Clean up the modal backdrop and remove `modal-open` class
    document.querySelectorAll('.modal-backdrop').forEach((el) => el.remove());
    document.body.classList.remove('modal-open');
    document.body.style.overflow = ''; // Reset overflow if it was modified
}
