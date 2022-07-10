## This project is live at [ https://postonetherum.web.app ](https://postonetherum.web.app/)

# About
I build this project as a part of learning Blockchain. it is simple blogging plotform which allow user to write blogs and store them in the etherum blockchain network. on other hand readers can reward the bloggers by sending the eth directly to author eth address.

## Smart contact
The smart contract used for this project is [ BlogPosts.sol ](https://github.com/VamsiSmart/BlogsOnEtherum/blob/master/BlogPost.sol) which has following two main methods.

**writeBlog** : this method allow users to post blogs and save them in a array called blogs
```solidity
function writeBlog(string calldata author,string calldata title,string calldata post) public{
   blogs.push(Blog(title, author, post,0,block.timestamp,msg.sender));
   count++;
}
```


**readBlogs** : this method allow users to retrive blogs from the network
```solidity
function readBlogs() public view returns(Blog[] memory){
   return blogs;
}
```

**sendLike** : this method allow users send 0.05 eth to the smartcontract, then smartcontract send 0.04 eth to the blogger and 0.01 eth to the contract owner 
```solidity
function sendLike(uint index) public payable{
   payable(blogs[index].authorAddress).transfer(0.004 ether);
   owner.transfer(0.001 ether);
   blogs[index].likes++;
}
```
## Front end
I used the Bootstrap framework and jQuery library for developing front end. you can checkout the source files at [ index.html ](https://github.com/VamsiSmart/BlogsOnEtherum/blob/master/index.html) and [ index.js ](https://github.com/VamsiSmart/BlogsOnEtherum/blob/master/index.js)

