$(document).ready(function () {


    var web3 = null;
    var account;
    var myContract;
    const abi = [
        {
            "inputs": [],
            "stateMutability": "nonpayable",
            "type": "constructor"
        },
        {
            "inputs": [],
            "name": "readBlogs",
            "outputs": [
                {
                    "components": [
                        {
                            "internalType": "string",
                            "name": "title",
                            "type": "string"
                        },
                        {
                            "internalType": "string",
                            "name": "author",
                            "type": "string"
                        },
                        {
                            "internalType": "string",
                            "name": "post",
                            "type": "string"
                        },
                        {
                            "internalType": "uint256",
                            "name": "likes",
                            "type": "uint256"
                        },
                        {
                            "internalType": "uint256",
                            "name": "time",
                            "type": "uint256"
                        },
                        {
                            "internalType": "address",
                            "name": "authorAddress",
                            "type": "address"
                        }
                    ],
                    "internalType": "struct BlogPost.Blog[]",
                    "name": "",
                    "type": "tuple[]"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "index",
                    "type": "uint256"
                }
            ],
            "name": "sendLike",
            "outputs": [],
            "stateMutability": "payable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "string",
                    "name": "author",
                    "type": "string"
                },
                {
                    "internalType": "string",
                    "name": "title",
                    "type": "string"
                },
                {
                    "internalType": "string",
                    "name": "post",
                    "type": "string"
                }
            ],
            "name": "writeBlogs",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        }
    ];

    var localResult = [];

    const contractAddress = '0x8f0da141f316dbb715b2a27402427c9c164ec1d7';

    if (window.ethereum == undefined) {
        $("#b_main_call").text("Install Metamask");
    } else if (account == undefined) {
        $("#b_main_call").text("Connect to Metamask");
    } else {
        $("#b_main_call").text("Post your blog");
        showBlogs();
    }

    $("#b_main_call").click(function () {

        if (window.ethereum == undefined) {
            window.open('https://metamask.io', '_newtab' + Date());
        } else if (account == undefined) {
            web3 = new Web3(window.ethereum);
            init();
        } else {
            $('#staticBackdrop').modal('show');
        }

    });

    $('#submmit').click(function () {

        const name = $("#blog_name").val();
        const title = $("#blog_title").val();
        const post = $("#blog_body").val();

        console.log(title);
        console.log(post);


        showBlogs();

        myContract.methods.writeBlogs(name,title,post).send({ from: account })
            .then(function (result) {
                showBlogs();
            });

        $('#staticBackdrop').modal('hide');
    });

    $('#b_sendtip').click(function(){
        const id = $(this).attr('data-creatorid');

        myContract.methods.sendLike(id).send({ from: account,value: 5000000000000000})
            .then(function (result) {
                showBlogs();
            });

    });

    async function init() {

        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        account = accounts[0];

        $("#b_main_call").text("Post your blog");

        myContract = new web3.eth.Contract(abi, contractAddress, {
            from: account,
            gasPrice: '200000'
        });

        showBlogs();

    }


    function showBlogs() {
        $("#id_blogs").empty();


        myContract.methods.readBlogs().call({ from: account })
            .then(function (result) {

                localResult = result;

                result.forEach(function (blog,index) {

                    var options = {day: 'numeric', month: 'long', year: 'numeric', };
                    const date = (new Date(parseInt(blog.time+"000"))).toLocaleDateString("en-US",options);

                    var post = blog.post;
                    if(post.length>100) {
                        post = blog.post.substring(0,100);
                    }

                    $("#id_blogs").append(

                        '<div class="col">'
                        + '<div class="card shadow-sm">'
                        + '<div class="card-header">'+blog.author+'</div>'
                        + '<div class="card-body">'
                        + '<h5 class="card-title">'+blog.title+'</h5>'
                        + '<p class="card-text" data-creatorid="'+index+'" style="cursor:pointer;overflow:hidden;white-space: nowrap;">' + post + '</p>'
                        + '<div class="d-flex justify-content-between align-items-center">'
                        + '<div class="btn-group">'
                        + '<button data-creatorid="'+index+'" type="button" class="btn btn-sm btn-outline-secondary">Like</button>'
                        + '</div>'
                        + '<small class="text-muted">'+date+'</small>'
                        + '</div>'
                        + '</div>'
                        + '</div>'
                    );
                });


                $("#id_blogs button").click(function () {
                    $('#like').modal('show');
                    console.log("laat",$(this).attr('data-creatorid'));
                    $('#b_sendtip').attr('data-creatorid',$(this).attr('data-creatorid'));
                });

                $("#id_blogs .card-text").click(function () {

                    const id = $(this).attr('data-creatorid');

                    $('#blog_model_title').text(localResult[id].title);
                    $('#blog_model_content').text(localResult[id].post);

                    $('#blog_model').modal('show');
                });

            });

    }

});
