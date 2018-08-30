const functions = require('firebase-functions');
const express = require('express');
const app1 = express();

app1.get('/myQuestions/:questionid', (req, res) => {
	console.log("TEST");
	res.status(200).send(`<!DOCTYPE html>
<html lang="zh">
<!-- NEED TO BE TEST ABOUT IMAGES + CHANGE #images{} -->

<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>IT LOVE 回答</title>
    <!-- LOADING STYLESHEETS -->
    <link href="../css/font-awesome.min.css" rel="stylesheet">
    <link href="../css/newstyle.css" rel="stylesheet">
    <link href="../css/single-question.css" rel="stylesheet">
    <script src="../cordova.js"></script>
    <script src="https://www.gstatic.com/firebasejs/5.0.3/firebase.js"></script>
    <script>
    var config = {
        apiKey: "AIzaSyBZUz6V1Mkmwxpe781P8X6ZC7fPTUyiBIg",
        authDomain: "it-love1.firebaseapp.com",
        databaseURL: "https://it-love1.firebaseio.com",
        projectId: "it-love1",
        storageBucket: "it-love1.appspot.com",
        messagingSenderId: "782043275132"
    };
    firebase.initializeApp(config);
    </script>
    <script>
    var db = firebase.firestore();
    var ref = db.collection("Questions").doc("${req.params.questionid}");
    // var ref = db.collection("Questions").doc("K0orA8toMuCwKRTihTGo");
    ref.get().then(function(doc) {
        var dic = doc.data();
        if (doc.exists) {
            // var author = dic["Author"];
            var desc = dic["Description"];
            var public = dic["Public"];
            var time = dic["Time"];
            var number = dic["NumberOfAnswers"];
            //set HTML
            //set heading
            var numberDiv = document.getElementById("numberOfA2");
            numberDiv.innerHTML = number + " 备选方案";
            //set info
            var numberChild = document.getElementById("numberOfA");
            numberChild.innerHTML = number + " 备选方案";
            var descChild = document.getElementById("main-content");
            descChild.innerHTML = desc;
            var timeChild = document.getElementById("date");
            timeChild.innerHTML = time;

            var imageFather = document.getElementById("images");
            var subRef = db.collection("Questions").doc("${req.params.questionid}").collection("URLs");
            // var subRef = db.collection("Questions").doc("K0orA8toMuCwKRTihTGo").collection("URLs");
            var countImage = 0;
            subRef.get().then(function(querySnapshot) {
                querySnapshot.forEach(function(doc2) {
                    dic2 = doc2.data();
                    var image = document.createElement("img");
                    image.src = dic2["Image"];
                    image.id = 'show' + countImage;
                    image.setAttribute('width', '100');
                    image.setAttribute('height', '100');
                    image.setAttribute('margin', '7');
                    imageFather.appendChild(image);
                    document.getElementById(image.id).addEventListener("click", function() { showFullScreen(image.src) });
                    countImage = countImage + 1;
                });
            });

        } else {
            console.log("No such document!");
        }
    }).catch(function(error) {
        console.log("Error getting document:", error);
    });
    // add answers
    ref.collection("Answers").where("Approved", "==", true).orderBy("Likes").get().then(function(querySnapshot) {
        querySnapshot.forEach(function(doc1) {
            var dic1 = doc1.data();
            var author1 = dic1["Author"];
            var content = dic1["Content"];
            var likes = dic1["Likes"];
            var approve = dic1["Approved"];
            var date = dic1["Time"];
            var link;
            var name;
            db.collection("user").doc(author1).get().then(function(doc00) {
                var dic00 = doc00.data();
                if (dic00["Name"] != undefined) { name = dic00["Name"]; } else { name = author1; }
                if (dic00["Picture"] != undefined) { link = dic00["Picture"]; } else { link = "../images/user.png"; }
                console.log(link);
                // write html
                var userChild = document.createElement("div");
                userChild.setAttribute('class', 'comments-user');
                var imageChild = document.createElement("img");
                imageChild.src = link;
                console.log("test" + imageChild.src);
                imageChild.setAttribute('alt', 'anonymous');
                var nameChild = document.createElement("div");
                nameChild.setAttribute('class', 'user-name');
                nameChild.innerHTML = name;
                var dateChild = document.createElement("div");
                dateChild.setAttribute('class', 'comment-post-date');
                dateChild.innerHTML = "Posted on " + date;
                var contentChild = document.createElement("div");
                contentChild.setAttribute('class', 'comments-content');
                contentChild.innerHTML = content;
                var likeChild = document.createElement("p");
                likeChild.setAttribute('class', 'likes');
                likeChild.innerHTML = "赞的人数: " + likes;
                // var lineChild = document.createElement("hr");
                // lineChild.setAttribute('class', 'style-three');
                var father = document.createElement("div");
                father.setAttribute('class', 'article-content');
                // a answer is chosen and the question is considered as closed
                if (dic1["Selected"] != undefined && dic1["Selected"] == true) {
                    father.id = "selected";
                    document.getElementById("ursolution").style.display = "none";
                }
                var son = document.createElement("div");
                son.setAttribute('class', 'article-comment-top');
                var grandfather = document.getElementById("solutions");
                userChild.appendChild(imageChild);
                userChild.appendChild(nameChild);
                userChild.appendChild(dateChild);
                son.appendChild(userChild);
                son.appendChild(contentChild);
                son.appendChild(likeChild);
                son.onclick = function() {
                    likeChild.innerHTML = "赞的人数: " + (Number(likeChild.innerHTML.charAt(6)) + 1);
                    firebase.auth().onAuthStateChanged(function(user) {
                        if (user) {
                            var email = "" + user.email;
                            //current answer in question
                            var detailedRef = db.collection("Questions").doc("${req.params.questionid}").collection("Answers").doc(doc1.id);
                            // var detailedRef = db.collection("Questions").doc("K0orA8toMuCwKRTihTGo").collection("Answers").doc(doc1.id);
                            //current answer in user
                            var otherRef = db.collection("user").doc(email).collection("Answers").doc(doc1.id);
                            var answerLink = doc1.id;

                            if (author1 == email) {
                                alert("不可以给自己点赞哦 不要那么自恋嘛～");
                            } else {
                                console.log(likeChild.innerHTML.charAt(6));
                                // add into current user's answers list to show what he chooses
                                otherRef.get().then(function(doc3) {
                                    if (!doc3.exists) { // if it has not been chosen
                                        var questionLink = "${req.params.questionid}";
                                        // var questionLink = "K0orA8toMuCwKRTihTGo";
                                        otherRef.set({
                                                Type: "choose",
                                                QuestionID: questionLink,
                                                AnswersID: answerLink
                                            }).then(function() {
                                                console.log("Document successfully written!");
                                            })
                                            .catch(function(error) {
                                                console.error("Error writing document: ", error);
                                            });
                                        // add a like iff the current usr != author
                                        detailedRef.get().then(function(doc2) {

                                            var newLike = doc2.data()["Likes"] + 1;
                                            return detailedRef.update({
                                                    Likes: newLike
                                                })
                                                .then(function() {
                                                    console.log("Document successfully updated!");
                                                })
                                                .catch(function(error) {
                                                    // The document probably doesn't exist.
                                                    console.error("Error updating document: ", error);
                                                });
                                            // likeChild.innerHTML = "Number of people chose this: " + newLike;

                                        });
                                    } else {
                                        otherRef.delete().then(function() {
                                            likeChild.innerHTML = "赞的人数: " + (Number(likeChild.innerHTML.charAt(6)) - 2);
                                            console.log("Document successfully deleted!");
                                        }).then(function() {
                                            detailedRef.get().then(function(doc2) {
                                                var newLike = doc2.data()["Likes"] - 1;
                                                console.log("test" + newLike);
                                                return detailedRef.update({
                                                        Likes: newLike
                                                    })
                                                    .then(function() {
                                                        console.log("Document successfully updated!");
                                                    })
                                                    .catch(function(error) {
                                                        // The document probably doesn't exist.
                                                        console.error("Error updating document: ", error);
                                                    });
                                                console.log("test2" + newLike);
                                                // likeChild.innerHTML = "Number of people chose this: " + newLike;
                                            })
                                        }).catch(function(error) {
                                            console.error("Error removing document: ", error);
                                        });

                                    }
                                });
                                console.log("test3");
                                // detailedRef.get().then(function(doc4) {
                                //     likeChild.innerHTML = "赞的人数： " + doc4.data()["Likes"];
                                // });
                            }
                            // User is signed in.
                        } else {
                            // No user is signed in.
                            window.open('../登录.html');
                        }

                    });
                };
                father.appendChild(son);
                // father.appendChild(lineChild);
                grandfather.appendChild(father);
            });


        });
    });
    //<hr class="style-three">
    //                 <!-- FIRST LEVEL COMMENT 1 -->
    // <div class="article-content">
    //     <div class="article-comment-top">
    //         <div class="comments-user">
    //             <img src="images/user.png" alt="gomac user">
    //             <div class="user-name">John Doe</div>
    //             <div class="comment-post-date">Posted On
    //                 <span class="italics">20 May, 2016</span>
    //             </div>
    //         </div>
    //         <div class="comments-content">
    //             <p>
    //                 Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras in orci velit. Sed sodales diam in massa auctor iaculis. Nunc
    //                 lacinia vitae nunc vel condimentum. Etiam dignissim pulvinar vulputate. Mauris vitae
    //                 ex felis. Duis ante mi, faucibus nec sem at, venenatis pretium nibh. Nulla condimentum
    //                 a risus eu fermentum. Proin dapibus odio ex, vel tempor diam volutpat a. Class aptent
    //                 taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Vivamus
    //                 fermentum facilisis pellentesque.
    //             </p>
    //             <div class="article-read-more">
    //                 <button class="btn btn-default btn-sm">
    //                     <i class="fa fa-reply"></i> Reply</button>
    //             </div>
    //         </div>
    //         <!-- END SECOND LEVEL COMMENT -->
    //     </div>
    // </div>
    // <!-- END FIRST LEVEL COMMENT 1 -->
    //         function vote(option){
    //             var detailedRef = ref.collection("Answers").doc(option);
    //             // var likesChild;
    //             // detailedRef.get().then(function(doc){
    //             //     var dic = doc.data();
    //             //     likesChild = dic["Likes"];
    //             //     console.log("test ");
    //             //     console.log(likesChild);
    //             // }
    //             // detailedRef.update({
    //             //     capital: true
    //             // })
    //             // .then(function() {
    //             //     console.log("Document successfully updated!");
    //             // })
    //             // .catch(function(error) {
    //             // // The document probably doesn't exist.
    //             // console.error("Error updating document: ", error);
    //             // });
    //             // }
    //     ref.runTransaction(function(transaction) {
    //     // This code may get re-run multiple times if there are conflicts.
    //     return transaction.get(detailedRef).then(function(detailedRef) {
    //         if (!detailedRef.exists) {
    //             throw "Document does not exist!";
    //         }
    //         var newLike = detailedRef.data()["Likes"] + 1;
    //         console.log(newLike);
    //         transaction.update(detailedRef, { Likes: newLike });
    //     });
    // }).then(function() {
    //     console.log("Transaction successfully committed!");
    // }).catch(function(error) {
    //     console.log("Transaction failed: ", error);
    // });
    // }

    // Show image in full screen when clicked, worked for Cordova
    function showFullScreen(url) {
        FullScreenImage.showImageURL(url);
    }
    /**
     * init firestone
     */
    // Initialize Cloud Firestore through Firebase
    function initApp() {
        firebase.auth().onAuthStateChanged(function(user) {
            if (user) {
                document.getElementById('signintop').textContent = '';
                var tag = document.createElement("i");
                tag.setAttribute('class', 'fa fa-key');
                document.getElementById('signintop').appendChild(tag);
                var text = document.createElement("div");
                text.setAttribute('style', 'display: inline;');
                text.textContent = '注销';
                document.getElementById('signintop').appendChild(text);


                document.getElementById('signuptop').style.display = "none";
                var email = "" + user.email;
                var db = firebase.firestore();
                var ref = db.collection("user").doc(email);
                ref.get().then(function(doc) {
                    if (doc.exists) {
                        if (typeof doc.data == 'function') {
                            var dic = doc.data();
                            document.getElementById('welcome').textContent = '欢迎 ' + dic["Name"];
                            document.getElementById('welcome').addEventListener('click', openProfile);

                        }
                    } else {
                        console.log("No such document!");
                        document.getElementById('welcome').textContent = '欢迎 xxx （您还未命名）';
                        document.getElementById('welcome').addEventListener('click', openProfile);
                    }
                });
            } else {
                document.getElementById('system').style.display = "none";
            }
        });
        document.getElementById('signintop').addEventListener('click', toggleSignIn, false);
        document.getElementById('addsolution').addEventListener('click', addsolution);
        document.getElementById('submit').addEventListener('click', submit);
    }

    function openProfile() {
        window.open("../个人信息.html", "_self");
    }

    function toggleSignIn() {
        if (firebase.auth().currentUser) {
            // [START signout]
            firebase.auth().signOut();
            window.open('../登录.html', "_self");
            // [END signout]
        } else { window.open('../登录.html', "_self"); }
    }

    var numberOfSolutions = 1;
    var solutions = [];

    function addsolution() {
        console.log("testADD");
        document.getElementById('submit').style.display = "block";

        var outerdiv = document.createElement("div");

        // only allow one proposal a time!!!
        // numberOfSolutions++;
        // outerdiv.innerHTML = "你推荐的备选方案" + numberOfSolutions;
        outerdiv.innerHTML = "你推荐的备选方案";

        outerdiv.style.margin = "5px 25px 5px 25px";
        var solution = document.createElement("input");
        solution.type = "text";
        solution.setAttribute('class', 'solution');
        solution.style.margin = "5px 15px 5px 15px";
        solution.style.fontSize = "14px";
        outerdiv.appendChild(solution);
        document.getElementById('yoursolutions').appendChild(outerdiv);
        solutions.push(solution);

        // only allow one proposal a time!!!
        document.getElementById("addsolution").style.display = 'none';
    }

    function submit() { // only submit the first one.
        console.log("TEST: " + document.getElementsByClassName("solution")[0]);
        if (document.getElementsByClassName("solution")[0].textContent) {
            console.log(document.getElementsByClassName("solution")[0].textContent);
            firebase.auth().onAuthStateChanged(function(user) {
                var email = "" + user.email;
                var db = firebase.firestore();

                var ref = db.collection("user").doc(email).collection("Answers");
                // var ref = query.where("Approved", "==", true);
                var ref2 = db.collection("Questions").doc("${req.params.questionid}").collection("Answers");
                // var ref2 = query2.where("Approved", "==", true);
                // var ref2 = db.collection("Questions").doc("K0orA8toMuCwKRTihTGo").collection("Answers");
                // author
                var author = user.email;
                // var ref3 = db.collection("user").doc(email);
                // ref3.get().then(function(doc) {
                //     if (doc.exists) {
                //         if (typeof doc.data == 'function') {
                //             var dic = doc.data();
                //             if (dic["Name"] != undefined) {
                //                 name = dic["Name"];
                //             }
                //         }
                //     }
                // });
                // end for name
                // time
                var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
                var now = new Date();
                var thisMonth = months[now.getMonth()];
                var date = now.getDate();
                var year = now.getFullYear();
                if (date < 10) {
                    date = '0' + date;
                }
                var time = "" + date + " " + thisMonth + ", " + year;
                // end for time
                var questionlink = "${req.params.questionid}";
                // var questionlink = "K0orA8toMuCwKRTihTGo";

                // var numberOfNewA = 0;
                // if (document.getElementsByClassName("solution")) {
                //     solutions = document.getElementsByClassName("solution");
                //     numberOfNewA = solutions.length;
                // }

                // add into ref-user-questions ref2-questions
                if (solutions != undefined) {
                    console.log("Test2");
                    var x;
                    db.collection("Questions").doc("${req.params.questionid}").get().then(function(doc5) {
                        var dic5 = doc5.data();
                        console.log(dic5["Author"]);
                        if (dic5["Author"] == author) {
                            var solutiontext = solutions[x].value;
                            ref2.add({
                                Author: author,
                                Time: time,
                                Content: solutiontext,
                                Approved: true,
                                Likes: 0
                            });
                        } else {
                            for (x = 0; x < numberOfSolutions; x++) {
                                var solutiontext = solutions[x].value;
                                ref.add({
                                    Time: time,
                                    Content: solutiontext,
                                    QuestionID: questionlink,
                                    Type: "propose",
                                    Approved: false
                                });
                                ref2.add({
                                    Author: author,
                                    Time: time,
                                    Content: solutiontext,
                                    Approved: false,
                                    Likes: 0
                                });
                            }
                        }
                        location.reload();
                    });

                } else {
                    alert("请先填写建议");
                }
                // add numberOfAnswers
                // var ref3 = db.collection("Questions").doc("K0orA8toMuCwKRTihTGo");


                // var ref3 = db.collection("Questions").doc("${req.params.questionid}");
                // ref3.get().then(function(doc2) {
                //     var newAnswers = doc2.data()["NumberOfAnswers"] + numberOfSolutions;
                //     return ref3.update({
                //             NumberOfAnswers: newAnswers
                //         })
                //         .then(function() {
                //             console.log("Document successfully updated!");
                //         })
                //         .catch(function(error) {
                //             // The document probably doesn't exist.
                //             console.error("Error updating document: ", error);
                //         });
                // });
            });
        }
    }

    window.onload = function() {
        document.addEventListener("deviceready", onDeviceReady, false);
        initApp();
    };

    function onDeviceReady() {
        document.addEventListener("link", link, false);
        console.log("ready!");
    // Add similar listeners for other events
    }
    </script>
    <script type="text/javascript">
    function link(id) {
        var url = 'https://it-love1.firebaseapp.com/questions/' + id;
        var ref = cordova.InAppBrowser.open(url, "_self", "location=yes");
    }
    // script for SIDEBAR
    var db = firebase.firestore();
    var ref = db.collection("Questions");
    var newRef = ref.orderBy("NumberOfAnswers", "desc").limit(5);
    console.log(newRef);
    newRef.get().then(function(querySnapshot4) {
        querySnapshot4.forEach(function(doc) {

            var dic = doc.data();

            //console.log(author["Author"]);
            var description = dic["Description"];
            console.log(description);

            //add html
            // var ahref = document.createElement("a");

            // ahref.setAttribute('href', 'https://it-love1.firebaseapp.com/questions/' + doc.id);
            // ahref.style.color = "black";
            var father = document.createElement("div");
            father.setAttribute("class", "b");
            father.setAttribute("onclick", "link(\`+doc.id+"\`)");
            //var descChild = document.createElement("div");
            father.innerHTML = description;
            //father.appendChild(descChild);
            // ahref.appendChild(father);
            var li = document.createElement("li");
            li.appendChild(father);
            //var father = document.getElement("mostPopular");
            //father.setAttribute('class', 'article');

            // var contentChild = document.createElement("div");
            // contentChild.setAttribute('class', 'article-content');
            // var descChild = document.createElement("p");
            // descChild.innerHTML = desc;
            // descChild.setAttribute('class', 'block-with-text');
            // contentChild.appendChild(descChild);
            // var infoChild = document.createElement("div");
            // infoChild.setAttribute('class', 'article-info');
            // // time
            // var timeTag = document.createElement("i");
            // timeTag.setAttribute('class', 'fa fa-calendar-o');
            // var timeTime = document.createElement("div");
            // timeTime.setAttribute('class', 'tag');
            // timeTime.innerHTML = time;
            // // answers
            // var answersTag = document.createElement("i");
            // answersTag.setAttribute('class', 'fa fa-comments-o');
            // answersTag.style.margin = "0 0 0 10px";
            // var answersAns = document.createElement("div");
            // answersAns.setAttribute('class', 'tag');
            // answersAns.innerHTML = number + " Answers";
            // // add answers and time
            // infoChild.appendChild(timeTag);
            // infoChild.appendChild(timeTime);
            // infoChild.appendChild(answersTag);
            // infoChild.appendChild(answersAns);

            // father.appendChild(contentChild);
            // father.appendChild(infoChild);
            // ahref.appendChild(father);

            var grandfather = document.getElementById("mostPopular");
            grandfather.appendChild(li);

        });
    });
    </script>
</head>

<body>
    <div class="toppest">
        <div class="login-box">
            <div id="signintop">
                <i class="fa fa-key"></i> 登陆</div>
        </div>
        <div class="login-box" id="signuptop">
            <a href="../email-password.html">
                            <i class="fa fa-pencil"></i> 注册</a>
        </div>
        <div class="login-box" id="system">
            <a href="../系统消息.html">
                            <i class="fa fa-bell"></i> 系统消息</a>
        </div>
        <div class="login-box">
            <div id="welcome">
            </div>
        </div>
    </div>
    <!-- TOP NAVIGATION -->
    <div class="topnav-outline">
        <ul class="topnav">
            <li>
                <a href="../index.html">
                            <i class="fa fa-home"></i> 首页</a>
            </li>
            <li>
                <a href="../提问.html">
                            <i class="fa fa-book"></i> 提问</a>
            </li>
            <li>
                <a href="../回答.html">
                            <i class="fa fa-file-text-o"></i> 回答</a>
            </li>
            <li class="icon">
                <a href="javascript:void(0);" onclick="myFunction()">&#9776;</a>
            </li>
        </ul>
    </div>
    <!-- END TOP NAVIGATION -->
    <!-- MAIN SECTION -->
    <div class="question">
        <!-- ARTICLE  -->
        <div class="article">
            <div class="article-content">
                <p class="block-with-text" id="main-content" style="margin-left: 20px;">
                </p>
            </div>
            <!-- article-info bar -->
            <div class="article-info">
                <i class="fa fa-calendar-o"></i>
                <div id="date" class="tag"> </div>
                <i class="fa fa-comments-o"></i>
                <div id="numberOfA" class="tag"></div>
            </div>
            <div id="images">
            </div>
        </div>
        <!-- END ARTICLE -->
        <!-- COMMENTS  -->
        <div class="heading" style="margin-left: 20px; font-size: 17px;">
            <div class="tag">
                <i class="fa fa-comments-o" style="padding-left: 20px;"></i>
                <div id="numberOfA2"></div>
            </div>
        </div>
        <div id="solutions" class="solution">
        </div>
        <div id="ursolution">
            <button class="btn" id="addsolution">添加你的推荐备选方案</button>
            <div id="yoursolutions"></div>
            <button class="btn" id="submit" style="display: none;">提交</button>
        </div>
        <!-- Previous Rate Part -->
        <!--                             <div class="panel-transparent">
                                <div class="article-heading">
                                    <i class="fa fa-comment-o"></i> 留下你的意见
                                </div>
                                <form method="post" class="comment-form" >
                                    <div class="form-row align-items-center">
                                        <div class="col-auto my-1" id="add-solutions">
                                            <label class="mr-sm-2" for="inlineFormCustomSelect">Preference</label>
                                            <select class="custom-select mr-sm-2" id="inlineFormCustomSelect" onchange="scheduleA.call(this,event,this.value)">
                                                <option selected>Choose...</option>
                                                <option value="1">One</option>
                                                <option value="2">Two</option>
                                                <option value="3">Three</option>
                                                <option value="4">Other</option>
                                            </select>
                                        </div>
                                        <div class="col-auto my-1">
                                            <button type="submit" class="btn btn-primary">Submit</button>
                                        </div>
                                    </div>
                                </form>
                            </div> -->
        <!-- END LEAVE A REPLY SECTION -->
        <!-- END COMMENTS -->
    </div>
    <!-- SIDEBAR STUFF -->
    <div class="sidenav">
        <div class="heading">
            最火的问题
        </div>
        <hr class="style-three">
        <div>
            <ul id="mostPopular">
                <!-- <li>
                        <a href="#">
                                        <i class="fa fa-file-text-o"></i> How to change account password?</a>
                    </li>
                    <li>
                        <a href="#">
                                        <i class="fa fa-file-text-o"></i> How to edit order details?</a>
                    </li>
                    <li>
                        <a href="#">
                                        <i class="fa fa-file-text-o"></i> Add new user</a>
                    </li>
                    <li>
                        <a href="#">
                                        <i class="fa fa-file-text-o"></i> Change customer details</a>
                    </li>
                    <li>
                        <a href="#">
                                        <i class="fa fa-file-text-o"></i> Lookup existing customer in order form</a>
                    </li> -->
            </ul>
        </div>
    </div>
    <!-- END SIDEBAR STUFF -->
    <!-- END MAIN SECTION -->
    <!-- LOADING MAIN JAVASCRIPT -->
    <script src="../js/jquery-2.2.4.min.js"></script>
    <script src="../js/main.js"></script>
    <script src="../js/bootstrap.min.js"></script>
    <script src='https://cdn.rawgit.com/VPenkov/okayNav/master/app/js/jquery.okayNav.js'></script>
</body>

</html>`

		);
});
exports.singleQues = functions.https.onRequest(app1);
// exports.bigben = functions.https.onRequest((req, res) => {
//   const hours = (new Date().getHours() % 12) + 1 // london is UTC + 1hr;
//   res.status(200).send(`<!doctype html>
//     <head>
//       <title>Time</title>
//     </head>
//     <body>
//       ${'BONG '.repeat(hours)}
//     </body>
//   </html>`);
// });
// const express = require('express');
// const app = express();
// const cors = require('cors');
// app.get('/', (req, res) => {
//   res.send(`Root page`);
// });

// app.get('/second', (req, res) => {
//   res.send(`Sub function`);
// });

// app.get('/hello/:name', (req, res) => {
//   res.send(`Hello ${req.params.name}`);
// });

// // We name this function "route", which you can see is 
// // still surfaced in the HTTP URLs below.
// exports.route = functions.https.onRequest(app);






const app = express();


app.get('/questions/:questionid', (req, res) => {
  console.log("TEST2");
  res.status(200).send(`<!DOCTYPE html>
<html lang="zh">
<!-- need to replace example and add ui -->

<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>IT LOVE 历史问题</title>
    <!-- LOADING STYLESHEETS -->
    <!--     <link href="../css/bootstrap.css" rel="stylesheet"> -->
    <link href="../css/font-awesome.min.css" rel="stylesheet">
    <!--     <link href="../css/style.css" rel="stylesheet"> -->
    <link href="../css/newstyle.css" rel="stylesheet">
    <link href="../css/history-question.css" rel="stylesheet">
    <script src="../cordova.js"></script>
    <script src="https://www.gstatic.com/firebasejs/5.0.4/firebase.js"></script>
    <script>
    var config = {
        apiKey: "AIzaSyBZUz6V1Mkmwxpe781P8X6ZC7fPTUyiBIg",
        authDomain: "it-love1.firebaseapp.com",
        databaseURL: "https://it-love1.firebaseio.com",
        projectId: "it-love1",
        storageBucket: "it-love1.appspot.com",
        messagingSenderId: "782043275132"
    };
    firebase.initializeApp(config);
    </script>
    <script>
    /**
     * init firestone
     */
    // Initialize Cloud Firestore through Firebase
    function initApp() {
        firebase.auth().onAuthStateChanged(function(user) {
            if (user) {
                document.getElementById('signintop').textContent = '';
                var tag = document.createElement("i");
                tag.setAttribute('class', 'fa fa-key');
                document.getElementById('signintop').appendChild(tag);
                var text = document.createElement("div");
                text.setAttribute('style', 'display: inline;');
                text.textContent = '注销';
                document.getElementById('signintop').appendChild(text);

                document.getElementById('signuptop').style.display = "none";
                var email = "" + user.email;
                var db = firebase.firestore();
                var ref = db.collection("user").doc(email);
                ref.get().then(function(doc) {
                    if (doc.exists) {
                        if (typeof doc.data == 'function') {
                            var dic = doc.data();
                            document.getElementById('welcome').textContent = '欢迎 ' + dic["Name"];
                            document.getElementById('welcome').addEventListener('click', openProfile);
                        }
                    } else {
                        console.log("No such document!");
                        document.getElementById('welcome').textContent = '欢迎 xxx （您还未命名）';
                        document.getElementById('welcome').addEventListener('click', openProfile);
                    }
                });
            } else {
                document.getElementById('system').style.display = "none";
            }
        });
        document.getElementById('signintop').addEventListener('click', toggleSignIn, false);
        document.getElementById('submit').addEventListener('click', submit);
    }

    function openProfile() {
        window.open("../个人信息.html", "_self");
    }

    function toggleSignIn() {
        if (firebase.auth().currentUser) {
            // [START signout]
            firebase.auth().signOut();
            window.open('../登录.html', "_self");
            // [END signout]
        } else {window.open('../登录.html', "_self");}
    }

    window.onload = function() {
        document.addEventListener("deviceready", onDeviceReady, false);
        initApp();
    };

    function onDeviceReady() {
        document.addEventListener("showFull", showFullScreen, false);
        console.log("ready!");
    // Add similar listeners for other events
    }
    </script>
</head>

<body>
    <div class="toppest">
        <div class="login-box">
            <div id="signintop">
                <i class="fa fa-key"></i> 登陆</div>
        </div>
        <div class="login-box" id="signuptop">
            <a href="../email-password.html">
                            <i class="fa fa-pencil"></i> 注册</a>
        </div>
        <div class="login-box" id="system">
            <a href="../系统消息.html">
                            <i class="fa fa-bell"></i> 系统消息</a>
        </div>
        <div class="login-box">
            <div id="welcome">
            </div>
        </div>
    </div>
    <!-- TOP NAVIGATION -->
    <div class="topnav-outline">
        <ul class="topnav">
            <li>
                <a href="../index.html">
                            <i class="fa fa-home"></i> 首页</a>
            </li>
            <li>
                <a href="../提问.html">
                            <i class="fa fa-book"></i> 提问</a>
            </li>
            <li>
                <a href="../回答.html">
                            <i class="fa fa-file-text-o"></i> 回答</a>
            </li>
            <li class="icon">
                <a href="javascript:void(0);" onclick="myFunction()">&#9776;</a>
            </li>
        </ul>
    </div>
    <!-- END TOP NAVIGATION -->
    <!-- MAIN SECTION -->
    <div class="question">
        <!-- ARTICLE  -->
        <div class="article">
            <div class="article-content">
                <p class="block-with-text" id="main-content" style="margin-left: 20px;">
                </p>
            </div>
            <!-- article-info bar -->
            <div class="article-info">
                <i class="fa fa-calendar-o"></i>
                <div id="date" class="tag"> </div>
                <i class="fa fa-comments-o"></i>
                <div id="numberOfA" class="tag"></div>
            </div>
            <div id="images">
            </div>
        </div>
        <!-- END ARTICLE -->
        <!-- COMMENTS  -->
        <div class="heading" style="margin-left: 20px; font-size: 17px;">
            <div class="tag">
                <i class="fa fa-comments-o" style="padding-left: 20px;"></i>
                <div id="numberOfA2"></div>
            </div>
        </div>
        <div id="solutions" class="solution">
        </div>
    </div>
    <!-- sidebar -->
    <div class="sidenav">
        <div id="myChart"></div>
        <div class="heading">
            <i class="fa fa-comment-o"></i> 选择你觉得合适的解决方案
        </div>
        <form>
            <div id="add-solutions" style="margin-bottom:10px;">
                <!-- <select id="inlineFormCustomSelect" onchange="scheduleA.call(this.event,this.value)"> -->
                <select id="inlineFormCustomSelect" onchange="scheduleA()">
                    <option selected>Choose...</option>
                    <!--                         <option value="1">One</option>
                        <option value="2">Two</option>
                        <option value="3">Three</option> -->
                </select>
            </div>
            <button class="btn" id="submit">提交</button>
        </form>
        <div>
            <input type="checkbox" value="" id="defaultCheck1">
            <label for="defaultCheck1">
                从公共社区隐藏
            </label>
        </div>
    </div>
    <!--                 <script type="text/javascript">
                google.charts.load('current', { 'packages': ['corechart'] });
                google.charts.setOnLoadCallback(drawChart);


                function drawChart() {
                    var data = google.visualization.arrayToDataTable([
                        ['回答', '投票总数'],
                        ['回答1', 8],
                        ['回答2', 2],
                        ['回答3', 9],

                    ]);


                    var options = { 'title': '回答意见记录', 'width': 400, 'height': 300 };

                    // Display the chart inside the <div> element with id="piechart"
                    var chart = new google.visualization.PieChart(document.getElementById('piechart'));
                    chart.draw(data, options);
                }
                </script> -->
    <!-- <script type="text/javascript">
                var auth1 = firebase.auth();
                firebase.auth().onAuthStateChanged(function(user){
                    var email1 = ""+user.email;
                    var db = firebase.firestore();
                    var ref1 = db.collection("user").doc(email).collection("Questions").doc("${req.params.questionid}");



                });
            </script> -->
    <!-- END MAIN SECTION -->
    <!-- LOADING MAIN JAVASCRIPT -->
    <script src="../js/jquery-2.2.4.min.js"></script>
    <script src="../js/main.js"></script>
    <script src="../js/bootstrap.min.js"></script>
    <script src='https://cdn.rawgit.com/VPenkov/okayNav/master/app/js/jquery.okayNav.js'></script>
    <script type="text/javascript">
    var auth = firebase.auth();
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            //ref = db.collection("user").doc(email).collection("Questions").doc().collection("Images");
            var db = firebase.firestore();
            var email = "" + user.email;
            db.collection("user").doc(email).collection("Questions").doc("${req.params.questionid}").get().then(function(doc0) {
                var dic0 = doc0.data();
                var link = dic0["Ref"];
                var ref1 = db.collection("Questions").doc(link);
                var ref = db.collection("Questions").doc(link).collection("Answers").where("Approved", "==", true);

                ref1.get().then(function(doc) {
                    var dic = doc.data();
                    if (doc.exists) {
                        var author = dic["Author"];
                        var desc = dic["Description"];
                        var public = dic["Public"];
                        var time = dic["Time"];
                        var number = dic["NumberOfAnswers"];
                        //set HTML
                        //set heading
                        var numberDiv = document.getElementById("numberOfA2");
                        numberDiv.innerHTML = number + " 备选方案";
                        //set info
                        var numberChild = document.getElementById("numberOfA");
                        numberChild.innerHTML = number + " 备选方案";
                        var descChild = document.getElementById("main-content");
                        descChild.innerHTML = desc;
                        var timeChild = document.getElementById("date");
                        timeChild.innerHTML = time;

                        var imageFather = document.getElementById("images");
                        var subRef = db.collection("Questions").doc(link).collection("URLs");
                        // var subRef = db.collection("Questions").doc("K0orA8toMuCwKRTihTGo").collection("URLs");
                        var countImage;
                        subRef.get().then(function(querySnapshot) {
                            querySnapshot.forEach(function(doc2) {
                                dic2 = doc2.data();
                                var image = document.createElement("img");
                                image.src = dic2["Image"];
                                image.id = 'show' + countImage;
                                image.setAttribute('width', '100');
                                image.setAttribute('height', '100');
                                image.setAttribute('margin', '7');
                                imageFather.appendChild(image);
                                document.getElementById(image.id).addEventListener("click", function() { showFullScreen(image.src) });
                            });
                        });

                    } else {
                        console.log("No such document!");
                    }


                });




                //         ref1.get().then(function(querySnapshot) {
                //         querySnapshot.forEach(function(doc) {

                //         console.log("test111");
                //         console.log( " ==> ", doc.data().Description);
                //         console.log( " link ==> ", doc.data().LinkToImage);
                //         var description = doc.data().Description;
                //         var public = doc.data().Public;
                //         var time = doc.data().Time;

                // var child = document.createElement("div");
                // child.setAttribute('class', 'comments-user');


                // var desChild = document.createElement("div");
                // dateChild.setAttribute('class', 'comment-post-date');
                // dateChild.innerHTML = "Description " + description;
                // var dateChild = document.createElement("div");
                // dateChild.setAttribute('class', 'comment-post-date');
                // dateChild.innerHTML = "Posted on " + time;
                // var contentChild = document.createElement("div");
                // contentChild.setAttribute('class', 'comments-content');
                // contentChild.innerHTML = content;
                // var lineChild = document.createElement("hr");
                // lineChild.setAttribute('class', 'style-three');
                // var father = document.createElement("div");
                // father.setAttribute('class', 'article-content');
                // var son = document.createElement("div");
                // son.setAttribute('class', 'article-comment-top');
                // var grandfather = document.getElementById("displayQues");
                // child.appendChild(nameChild);
                // child.appendChild(dateChild);
                // son.appendChild(child);
                // son.appendChild(contentChild);
                // son.appendChild(likeChild); 
                // father.appendChild(son);
                // father.appendChild(lineChild);
                // grandfather.appendChild(father);


                //     });

                // });
                // add solutions
                var count = 0;
                ref.orderBy("Likes").get().then(function(querySnapshot) {
                    querySnapshot.forEach(function(doc) {

                        console.log("success");
                        var dic1 = doc.data();
                        var author1 = dic1["Author"];
                        var content = dic1["Content"];
                        var likes = dic1["Likes"];
                        var approve = dic1["Approved"];
                        var date = dic1["Time"];
                        var link;
                        var name;
                        db.collection("user").doc(author1).get().then(function(doc00) {
                            var dic00 = doc00.data();
                            if (dic00["Name"] != undefined) { name = dic00["Name"]; } else { name = author1; }
                            if (dic00["Picture"] != undefined) { link = dic00["Picture"]; } else { link = "../images/user.png"; }
                            console.log(link);
                            // write html
                            var userChild = document.createElement("div");
                            userChild.setAttribute('class', 'comments-user');
                            var imageChild = document.createElement("img");
                            imageChild.src = link;
                            console.log("test" + imageChild.src);
                            imageChild.setAttribute('alt', 'anonymous');
                            var nameChild = document.createElement("div");
                            nameChild.setAttribute('class', 'user-name');
                            nameChild.innerHTML = name;
                            var dateChild = document.createElement("div");
                            dateChild.setAttribute('class', 'comment-post-date');
                            dateChild.innerHTML = "Posted on " + date;
                            var contentChild = document.createElement("div");
                            contentChild.setAttribute('class', 'comments-content');
                            contentChild.innerHTML = content;
                            var likeChild = document.createElement("p");
                            likeChild.setAttribute('class', 'likes');
                            likeChild.innerHTML = "赞的人数 " + likes;
                            // var lineChild = document.createElement("hr");
                            // lineChild.setAttribute('class', 'style-three');
                            var father = document.createElement("div");
                            father.setAttribute('class', 'article-content');
                            if (dic1["Selected"] != undefined) {
                                father.id = "selected";
                            }
                            var son = document.createElement("div");
                            son.setAttribute('class', 'article-comment-top');
                            var grandfather = document.getElementById("solutions");
                            userChild.appendChild(imageChild);
                            userChild.appendChild(nameChild);
                            userChild.appendChild(dateChild);
                            son.appendChild(userChild);
                            son.appendChild(contentChild);
                            son.appendChild(likeChild);

                            father.appendChild(son);
                            // father.appendChild(lineChild);
                            grandfather.appendChild(father);

                            var grand2 = document.getElementById("inlineFormCustomSelect");
                            var grandson = document.createElement("option");
                            grandson.setAttribute('value', doc.id);
                            count++;
                            grandson.innerHTML = 'Solution #' + count;
                            console.log(grandson.value);
                            grand2.appendChild(grandson);
                        });


                    });

                });
            });
        } else {}
    });

    // work on cordova
    function showFullScreen(url) {
        FullScreenImage.showImageURL(url);
    }
    </script>
    <script type="text/javascript" src="https://www.gstatic.com/charts/loader.js"></script>
    <script type="text/javascript">
    var data;
    var chart;

    // Load the Visualization API and the piechart package.
    google.charts.load('current', { 'packages': ['corechart'] });

    // Set a callback to run when the Google Visualization API is loaded.
    google.charts.setOnLoadCallback(drawChart);

    // Callback that creates and populates a data table,
    // instantiates the pie chart, passes in the data and
    // draws it.
    function drawChart() {
        // Create our data table.
        data = new google.visualization.DataTable();
        data.addColumn('string', 'Solutions');
        data.addColumn('number', 'Likes');
        var auth = firebase.auth();
        firebase.auth().onAuthStateChanged(function(user) {
            if (user) {

                var db = firebase.firestore();
                var email = "" + user.email;
                //var ref = db.collection("user").doc(email).collection("Questions").doc("${req.params.questionid}").collection("Answers");
                var ref2 = db.collection("user").doc(email).collection("Questions").doc("${req.params.questionid}");
                ref2.get().then(function(doc) {
                    var dic = doc.data();
                    var link = dic["Ref"];
                    var ref3 = db.collection("Questions").doc(link);
                    ref3.collection("Answers").where("Approved", "==", true).orderBy("Likes").get().then(function(querySnapshot) {
                        querySnapshot.forEach(function(doc) {
                            console.log(typeof(doc.data()["Author"]));
                            console.log(typeof(doc.data()["Likes"]));
                            data.addRow([doc.data()["Author"], doc.data()["Likes"]]);
                        });
                        var options = {
                            'title': '每个方案的赞同人数',
                            'width': 400,
                            'height': 300
                        };

                        // Instantiate and draw our chart, passing in some options.
                        chart = new google.visualization.BarChart(document.getElementById('myChart'));
                        google.visualization.events.addListener(chart, 'select', selectHandler);
                        chart.draw(data, options);
                    });
                });
            } else {}
        });

        //         ''+

        // data.addRows([          
        //   ['Mushrooms', 3],
        //   ['Onions', 1],
        //   ['Olives', 1],
        //   ['Zucchini', 1],
        //   ['Pepperoni', 2]
        // ]);

        // Set chart options

    }

    function selectHandler() {
        var selectedItem = chart.getSelection()[0];
        var value = data.getValue(selectedItem.row, 0);
        alert('The user selected ' + value);
    }

    var selectedOption;

    // function scheduleA(event, value) {
    function scheduleA() {
        // if (event == "1") return;
        // if (event == "2") return;
        // if (event == "3") return;
        // if (event == "4") {
        //     var div = document.createElement('div');
        //     var btn = document.createElement("form");
        //     var i = document.createElement("input");
        //     i.setAttribute('type', "text");
        //     i.setAttribute('name', "username");
        //     i.setAttribute("placeholder", "输入新的解决方案");

        //     btn.appendChild(i);
        //     div.appendChild(btn);

        //     document.getElementById("add-solutions").appendChild(div);
        //     console.log("Test");
        // }
        selectedOption = document.getElementById("inlineFormCustomSelect").value;
        console.log("select " + selectedOption);
    }

    function submit() {
        // 给提供建议的人加钱

        firebase.auth().onAuthStateChanged(function(user) {
            if (user) {
                var email = "" + user.email;
                var db = firebase.firestore();
                db.collection("user").doc(email).collection("Questions").doc("${req.params.questionid}").get().then(function(doc0) {
                    var dic0 = doc0.data();
                    var link = dic0["Ref"];
                    console.log("success" + link);
                    var ref = db.collection("Questions").doc(link);
                    if (selectedOption == undefined) {
                        alert("请先选择一个方案再提交");
                    } else {
                        var ref1 = ref.collection("Answers").doc(selectedOption);
                        ref1.set({
                            Selected: true
                        }, { merge: true });
                        ref.update({
                            Status: "已完结"
                        });
                    }

                });


                alert("提交成功!");
            } else {}
        });
    }
    </script>
</body>

</html>`);
});
exports.single = functions.https.onRequest(app);



const app2 = express();
app2.get('/search/:searchcontent', (req, res) => {
    console.log("TEST");
    res.status(200).send(`<!DOCTYPE html>
<html lang="zh">

<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>IT LOVE回答</title>
    <!-- LOADING STYLESHEETS -->
<!--     <link href="../css/bootstrap.css" rel="stylesheet">
    <link href="../css/font-awesome.min.css" rel="stylesheet"> -->
    <link href="../css/newstyle.css" rel="stylesheet">
    <link href="../css/all-questions.css" rel="stylesheet">
    <script src="https://www.gstatic.com/firebasejs/5.0.3/firebase.js"></script>
    <script>
    var config = {
        apiKey: "AIzaSyBZUz6V1Mkmwxpe781P8X6ZC7fPTUyiBIg",
        authDomain: "it-love1.firebaseapp.com",
        databaseURL: "https://it-love1.firebaseio.com",
        projectId: "it-love1",
        storageBucket: "it-love1.appspot.com",
        messagingSenderId: "782043275132"
    };
    firebase.initializeApp(config);
    </script>
    <script src="../cordova.js"></script>
    <script>
    function check(des, string) {
        var index = 0;
        var changingstring;
        for (var i = 0; i < string.length; i++) {
            for (var k = 0; k <= i; k++) {
                changingstring = string.substring(k, k + string.length - i);
                //if(des.includes(changingstring)) index ++;
                for (var j = 0; j <= des.length - changingstring.length; j++) {
                    if (des.substring(j, j + changingstring.length) == changingstring) index++;
                }
            }

        }
        return index;


    }

    var db = firebase.firestore();
    var ref = db.collection("Questions");
    ref.get().then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {

            console.log("test" + doc.id);
            // doc.data() is never undefined for query doc snapshots

            //console.log(doc.id, " => ", doc.data());
            var dic = doc.data();

            var desc = dic["Description"];

            return ref.doc(doc.id).update({ index: check(desc, "${req.params.searchcontent}") });
        });
    });

    var newRef = ref.where("index", ">", 0).where("Public", "==", true).orderBy("index");
    newRef.get().then(function(querySnapshot3) {
        querySnapshot3.forEach(function(doc) {
            // var dic = doc.data();
            // //console.log(author["Author"]);
            // var author = dic["Author"];
            // var desc = dic["Description"];
            // var link = dic["LinkToImage"];
            // var public = dic["Public"];
            // var time = dic["Time"];


            // var ahref = document.createElement("a");
            // ahref.setAttribute('href', 'https://it-love1.firebaseapp.com/questions/' + doc.id);
            // var father = document.createElement("div");
            // father.setAttribute('class', 'panel panel-default');
            // var authorChild = document.createElement("p");
            // authorChild.innerHTML = author;
            // var descChild = document.createElement("div");
            // descChild.innerHTML = desc;
            // descChild.setAttribute('class', 'article-content');
            // var timeChild = document.createElement("div");
            // timeChild.innerHTML = time;
            // timeChild.setAttribute('class', 'art-date');
            // father.appendChild(authorChild);
            // father.appendChild(descChild);
            // father.appendChild(timeChild);
            // ahref.appendChild(father);

            // var grandfather = document.getElementById("allQ");
            // grandfather.appendChild(ahref);
            var dic = doc.data();
            //console.log(author["Author"]);
            var author = dic["Author"];
            var desc = dic["Description"];
            var link = dic["LinkToImage"];
            var time = dic["Time"];
            var number = dic["NumberOfAnswers"];

            //add html
            var ahref = document.createElement("a");
            ahref.setAttribute('href', 'https://it-love1.firebaseapp.com/questions/' + doc.id);
            ahref.style.color = "black";
            var father = document.createElement("div");
            father.setAttribute('class', 'article');
            // var authorChild = document.createElement("p");
            // authorChild.innerHTML = author;
            // authorChild.setAttribute('class', 'article');
            var contentChild = document.createElement("div");
            contentChild.setAttribute('class', 'article-content');
            var descChild = document.createElement("p");
            descChild.innerHTML = desc;
            descChild.setAttribute('class', 'block-with-text');
            contentChild.appendChild(descChild);
            var infoChild = document.createElement("div");
            infoChild.setAttribute('class', 'article-info');
            // time
            var timeTag = document.createElement("i");
            timeTag.setAttribute('class', 'fa fa-calendar-o');
            var timeTime = document.createElement("div");
            timeTime.setAttribute('class', 'tag');
            timeTime.innerHTML = time;
            // answers
            var answersTag = document.createElement("i");
            answersTag.setAttribute('class', 'fa fa-comments-o');
            answersTag.style.margin = "0 0 0 10px";
            var answersAns = document.createElement("div");
            answersAns.setAttribute('class', 'tag');
            answersAns.innerHTML = number + " Answers";
            // add answers and time
            infoChild.appendChild(timeTag);
            infoChild.appendChild(timeTime);
            infoChild.appendChild(answersTag);
            infoChild.appendChild(answersAns);

            father.appendChild(contentChild);
            father.appendChild(infoChild);
            ahref.appendChild(father);

            var grandfather = document.getElementById("allQ");
            grandfather.appendChild(ahref);

        });
    });

    //if(dic["Description"].includes("${req.params.searchcontent}")){

    //add html

    //} 

    // <div class="panel panel-default">
    //                         <div class="article-heading-abb">
    //                             <a href="单个回答.html">
    //                                 <i class="fa fa-pencil-square-o"></i> How to change account password?</a>
    //                         </div>
    //                         <div class="article-info">
    //                             <div class="art-date">
    //                                 <a href="#">
    //                                     <i class="fa fa-calendar-o"></i> 20 May, 2016 </a>
    //                             </div>
    //                             <div class="art-category">
    //                                 <a href="#">
    //                                     <i class="fa fa-folder"></i> Account Settings </a>
    //                             </div>
    //                             <div class="art-comments">
    //                                 <a href="#">
    //                                     <i class="fa fa-comments-o"></i> 4 Comments </a>
    //                             </div>
    //                         </div>
    //                         <div class="article-content">
    //                             <p class="block-with-text">
    //                                 Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam sit amet finibus dui. Fusce ac nulla nec ex ornare vehicula
    //                                 non nec mi. Cras eget nisi sem. Cum sociis natoque penatibus et magnis dis parturient montes,
    //                                 nascetur ridiculus mus. Donec viverra faucibus magna sed interdum. Phasellus ultrices sagittis
    //                                 molestie. Sed sit amet nisl id risus egestas semper. In porta, arcu eu dignissim vestibulum,
    //                                 sapien justo imperdiet enim, sed facilisis quam justo in neque. Aliquam fermentum arcu eget
    //                                 hendrerit efficitur.
    //                             </p>
    //                         </div>
    //                         <div class="article-read-more">
    //                             <a href="单个回答.html" class="btn btn-default btn-wide">Read more...</a>
    //                         </div>
    //                     </div>

    //add answers
    // var answers = dic["Answers"].get().then(function(querySnapshot1){
    //     querySnapshot1.forEach(function(doc1){
    //         var dic1 = doc1.data();
    //         var author1 = dic1["Author"];
    //         var content = dic1["Content"];
    //         var likes = dic1["Likes"];
    //         var approve = dic1["Approved"];
    //     });
    // });
    </script>
    <script>
    /**
     * init firestone
     */
    // Initialize Cloud Firestore through Firebase
    function initApp() {
        firebase.auth().onAuthStateChanged(function(user) {
            if (user) {
                document.getElementById('signintop').textContent = '';
                var tag = document.createElement("i");
                tag.setAttribute('class', 'fa fa-key');
                document.getElementById('signintop').appendChild(tag);
                var text = document.createElement("div");
                text.setAttribute('style', 'display: inline;');
                text.textContent = '注销';
                document.getElementById('signintop').appendChild(text);

                document.getElementById('signuptop').style.display = "none";
                var email = "" + user.email;
                var db = firebase.firestore();
                var ref = db.collection("user").doc(email);
                ref.get().then(function(doc) {
                    if (doc.exists) {
                        if (typeof doc.data == 'function') {
                            var dic = doc.data();
                            document.getElementById('welcome').textContent = '欢迎 ' + dic["Name"];
                            document.getElementById('welcome').addEventListener('click', openProfile);
                        }
                    } else {
                        console.log("No such document!");
                        document.getElementById('welcome').textContent = '欢迎 xxx （您还未命名）';
                        document.getElementById('welcome').addEventListener('click', openProfile);
                    }
                });
            } else {
                document.getElementById('system').style.display = "none";
            }
        });
        document.getElementById('signintop').addEventListener('click', toggleSignIn, false);
    }

    function openProfile(){
        window.open("../个人信息.html", "_self");
    }

    function toggleSignIn() {
        if (firebase.auth().currentUser) {
            // [START signout]
            firebase.auth().signOut();
            window.open('../登录.html', "_self");
            // [END signout]
        } else {window.open('../登录.html', "_self");}
    }

    window.onload = function() {
        document.addEventListener("deviceready", onDeviceReady, false);
        initApp();
    };

    function onDeviceReady() {
        document.addEventListener("link", link, false);
        console.log("ready!");
    // Add similar listeners for other events
    }

    var db = firebase.firestore();
    var ref = db.collection("Questions");
    var newRef = ref.orderBy("NumberOfAnswers","desc").limit(5);
    console.log(newRef);
    newRef.get().then(function(querySnapshot4) {
        querySnapshot4.forEach(function(doc) {

            var dic = doc.data();

            //console.log(author["Author"]);
            var description = dic["Description"];
            console.log(description);

            //add html
            // var ahref = document.createElement("a");

            // ahref.setAttribute('href', 'https://it-love1.firebaseapp.com/questions/' + doc.id);
            // ahref.style.color = "black";
            var father = document.createElement("div");
            father.setAttribute("class", "b");
            father.setAttribute("onclick", "link(\`+doc.id+"\`)");
            //var descChild = document.createElement("div");
            father.innerHTML = description;
            //father.appendChild(descChild);
            // ahref.appendChild(father);
            var li = document.createElement("li");
            li.appendChild(father);
            //var father = document.getElement("mostPopular");
            //father.setAttribute('class', 'article');
            
            // var contentChild = document.createElement("div");
            // contentChild.setAttribute('class', 'article-content');
            // var descChild = document.createElement("p");
            // descChild.innerHTML = desc;
            // descChild.setAttribute('class', 'block-with-text');
            // contentChild.appendChild(descChild);
            // var infoChild = document.createElement("div");
            // infoChild.setAttribute('class', 'article-info');
            // // time
            // var timeTag = document.createElement("i");
            // timeTag.setAttribute('class', 'fa fa-calendar-o');
            // var timeTime = document.createElement("div");
            // timeTime.setAttribute('class', 'tag');
            // timeTime.innerHTML = time;
            // // answers
            // var answersTag = document.createElement("i");
            // answersTag.setAttribute('class', 'fa fa-comments-o');
            // answersTag.style.margin = "0 0 0 10px";
            // var answersAns = document.createElement("div");
            // answersAns.setAttribute('class', 'tag');
            // answersAns.innerHTML = number + " Answers";
            // // add answers and time
            // infoChild.appendChild(timeTag);
            // infoChild.appendChild(timeTime);
            // infoChild.appendChild(answersTag);
            // infoChild.appendChild(answersAns);

            // father.appendChild(contentChild);
            // father.appendChild(infoChild);
            // ahref.appendChild(father);

            var grandfather = document.getElementById("mostPopular");
            grandfather.appendChild(li);

        });
    });
    function link(id) {
        var url = 'https://it-love1.firebaseapp.com/questions/' + id;
        var ref = cordova.InAppBrowser.open(url, "_self", "location=yes");
    }
    </script>
</head>

<body>
    <div class="toppest">
        <div class="login-box">
            <div id="signintop">
                <i class="fa fa-key"></i> 登陆</div>
        </div>
        <div class="login-box" id="signuptop">
            <a href="../email-password.html">
                            <i class="fa fa-pencil"></i> 注册</a>
        </div>
        <div class="login-box" id="system">
            <a href="../系统消息.html">
                            <i class="fa fa-bell"></i> 系统消息</a>
        </div>
        <div class="login-box">
            <div id="welcome">
            </div>
        </div>
    </div>
    <!-- TOP NAVIGATION -->
    <div class="topnav-outline">
        <ul class="topnav">
            <li>
                <a href="../index.html">
                            <i class="fa fa-home"></i> 首页</a>
            </li>
            <li>
                <a href="../提问.html">
                            <i class="fa fa-book"></i> 提问</a>
            </li>
            <li>
                <a href="../回答.html">
                            <i class="fa fa-file-text-o"></i> 回答</a>
            </li>
            <li class="icon">
                <a href="javascript:void(0);" onclick="myFunction()">&#9776;</a>
            </li>
        </ul>
    </div>
    <!-- END TOP NAVIGATION -->
    <!-- SEARCH FIELD AREA -->
    <div class="searchfield">
        <input type="text" class="search" placeholder="搜索你的情感问题" id="searchcontent">
        <button class="btn buttonsearch" onclick="search()">搜索</button>
    </div>
    <!-- END SEARCH FIELD AREA -->
    <!-- MAIN SECTION -->
    <!-- ARTICLE OVERVIEW SECTION -->
    <h1 class=pageheader>搜索结果</h1>
    <!-- UNDECIDED    
    <div class="sort">
        <button id=# class="btn"> 升序</a>
            <button id=# class="btn"> 降序</a>
    </div> -->
    <!-- ARTICLES -->
    <div class="questions">
        <div id="allQ">
            <!-- Used to generate questions from database -->
            <hr class="style-three">
            <!-- <div class="article">
                <div class="article-content">
                    <p class="block-with-text">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam sit amet finibus dui. Fusce ac nulla nec ex ornare vehicula non nec mi. Cras eget nisi sem. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec viverra faucibus magna sed interdum. Phasellus ultrices sagittis molestie. Sed sit amet nisl id risus egestas semper. In porta, arcu eu dignissim vestibulum, sapien justo imperdiet enim, sed facilisis quam justo in neque. Aliquam fermentum arcu eget hendrerit efficitur.
                    </p>
                </div>
                <div class="article-info">
                    <div class="tag">
                        <i class="fa fa-calendar-o"></i> 20 May, 2016 </a>
                    </div>
                    <div class="tag">
                        <i class="fa fa-comments-o"></i> 4 Comments </a>
                    </div>
                </div>
            </div> -->
        </div>
        <!-- END ARTICLES OVERVIEW SECTION-->
        <!-- SIDEBAR STUFF -->
        <div class="sidenav">
            <div class="heading">
                最火的问题
            </div>
            <hr class="style-three">
            <div>
                <ul id="mostPopular">
                    <!-- <li>
                        <a href="#">
                                        <i class="fa fa-file-text-o"></i> How to change account password?</a>
                    </li>
                    <li>
                        <a href="#">
                                        <i class="fa fa-file-text-o"></i> How to edit order details?</a>
                    </li>
                    <li>
                        <a href="#">
                                        <i class="fa fa-file-text-o"></i> Add new user</a>
                    </li>
                    <li>
                        <a href="#">
                                        <i class="fa fa-file-text-o"></i> Change customer details</a>
                    </li>
                    <li>
                        <a href="#">
                                        <i class="fa fa-file-text-o"></i> Lookup existing customer in order form</a>
                    </li> -->
                </ul>
            </div>
        </div>
        <!-- END SIDEBAR STUFF -->
    </div>
    <!-- END MAIN SECTION -->
    <!-- LOADING MAIN JAVASCRIPT -->
    <script src="../js/jquery-2.2.4.min.js"></script>
    <script src="../js/main.js"></script>
    <script src="../js/bootstrap.min.js"></script>
    <script src='https://cdn.rawgit.com/VPenkov/okayNav/master/app/js/jquery.okayNav.js'></script>
    <script>
    function search() {
        var content = "" + document.getElementById("searchcontent").value;
        console.log(content);
        if (content != "") {
            window.open('https://it-love1.firebaseapp.com/search/' + content, "_self");
        } else {
            window.open('../回答.html', "_self");
        }
    }
    </script>
</body>

</html>`);});
exports.search = functions.https.onRequest(app2);