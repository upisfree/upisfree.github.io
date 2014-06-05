/*
var userId;

VK.init(
{
  apiId: 4398849
});

function authInfo(response)
{
  if (response.session)
  {
    userId = response.session.mid;
  }
  else
  {
    alert('not auth');
  }
}

VK.Auth.getLoginStatus(authInfo);

function post()
{
  VK.Api.call('photos.getWallUploadServer', {group_id: userId}, function(r) {console.log(r)});
//  VK.Api.call('wall.post', {message: "Post via VK Open API "}, function(r) {alert('posted')});
}

  <!--
    <div onclick="VK.Auth.login(authInfo);">логинь меня в вк</div>
    <div onclick="post();">post</div>
  -->

*/