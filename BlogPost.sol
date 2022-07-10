// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.7;

contract BlogPost {

    struct Blog { 
        string title;
        string author;
        string post;
        uint likes;
        uint time;
        address authorAddress;
    }

    address payable owner;

    constructor() {
        owner = payable(msg.sender);
    }

    Blog[] blogs;
    uint count;

    function writeBlog(string calldata author,string calldata title,string calldata post) public{
        blogs.push(Blog(title, author, post,0,block.timestamp,msg.sender));
        count++;
    }
    
    function sendLike(uint index) public payable{
        payable(blogs[index].authorAddress).transfer(0.004 ether);
        owner.transfer(0.001 ether);
        blogs[index].likes++;
    }

    function readBlogs() public view returns(Blog[] memory){
        return blogs;
    }

}