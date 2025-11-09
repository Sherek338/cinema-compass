class UserDTO {
  constructor(user) {
    this.id = user._id;
    this.username = user.username;
    this.email = user.email;
    this.isActivated = user.isActivated;
    this.favoriteList = user.favoriteList;
    this.watchList = user.watchList;
  }
}

export default UserDTO;
