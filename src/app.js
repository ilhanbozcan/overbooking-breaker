
 const login = $('#login')
 const roomList = $('#room-list')
 const addForm = $('#add-form')
 const signup = $('#signup')
 const signupButton = $('#b-signup')
 const logoutButton = $('#b-logout')




if(localStorage.getItem('user')){
  if(localStorage.getItem('user') == 'admin'){
    login.hide()
    signup.hide()
    roomList.show()
    addForm.show()
    signupButton.hide()
  }
  else{
    login.hide()
    roomList.show()
    signup.hide()
    signupButton.hide()

  }
  
}
else{
  login.show()
  roomList.hide()
  signup.hide()
  signupButton.show()
  logoutButton.hide()

}
App = {
  loading: false,
  contracts: {},

  load: async () => {
    await App.loadWeb3()
    await App.loadAccount()
    await App.loadContract()
    await App.render()
  },

  loadWeb3: async () => {
    if (typeof web3 !== 'undefined') {
      App.web3Provider = web3.currentProvider
      web3 = new Web3(web3.currentProvider)
    } else {
      window.alert("Please connect to Metamask.")
    }
    // Modern dapp browsers...
    if (window.ethereum) {
      window.web3 = new Web3(ethereum)
      try {
        // Request account access if needed
        await ethereum.enable()
        // Acccounts now exposed
        web3.eth.sendTransaction({/* ... */})
      } catch (error) {
        // User denied account access...
      }
    }
    // Legacy dapp browsers...
    else if (window.web3) {
      App.web3Provider = web3.currentProvider
      window.web3 = new Web3(web3.currentProvider)
      // Acccounts always exposed
      web3.eth.sendTransaction({/* ... */})
    }
    // Non-dapp browsers...
    else {
      console.log('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  },

  loadAccount: async () => {
    // Set the current blockchain account
    App.account = web3.eth.accounts[0]
    web3.eth.defaultAccount = web3.eth.accounts[0]

    console.log(web3.eth.accounts)
    console.log(App.account)
  },

  loadContract: async () => {
    // Create a JavaScript version of the smart contract
    const todoList = await $.getJSON('Contract.json')
    const user = await $.getJSON('User.json')

    App.contracts.TodoList = TruffleContract(todoList)
    App.contracts.User = TruffleContract(user)

    App.contracts.TodoList.setProvider(App.web3Provider)
    App.contracts.User.setProvider(App.web3Provider)


    // Hydrate the smart contract with values from the blockchain
    App.todoList = await App.contracts.TodoList.deployed()
    App.user = await App.contracts.User.deployed()
    console.log(App.user)

  },

  render: async () => {
    // Prevent double render
    if (App.loading) {
      return
    }

    // Update app loading state
    App.setLoading(true)

    // Render Account
    $('#account').html(localStorage.getItem('user') ? localStorage.getItem('user') : "" )

    // Render Tasks
    await App.renderTasks()

    // Update loading state
    App.setLoading(false)
  },

  renderTasks: async () => {
    // Load the total task count from the blockchain
    const roomCount = await App.todoList.roomCount()
    console.log('asdasdasd',roomCount)
    console.log(App)

    const $taskTemplate = $('.taskTemplate')

  

    for (var i = 1; i <= roomCount; i++) {
      console.log('for a girdi')
      // Fetch the task data from the blockchain
      
      const room = await App.todoList.rooms(i)
      const taskId = room[0].toNumber()
      const taskContent = room[1]
      const taskAllocation = room[2]

      // Create the html for the task
      const $newTaskTemplate = $taskTemplate.clone()
      $newTaskTemplate.find('.content').html(taskContent + ' ' + taskAllocation)
      $newTaskTemplate.find('button')
                      .prop('name', taskId)
                      .on('click', App.doReservation)
      $('#taskList').append($newTaskTemplate)



      // Show the task
      $newTaskTemplate.show()
    }
  },

  createTask: async () => {
    App.setLoading(true)
    const content = $('#newTask').val()
    console.log(content)
    console.log(App.todoList)
    await App.todoList.createTask(content)
    window.location.reload()
  },


  createRoom: async () => {
    App.setLoading(true)
    const content = $('#newTask').val()
    const accom = $('#accom').val()

    
    await App.todoList.createRoom(content,accom)
    window.location.reload()
  },

  toggleCompleted: async (e) => {
    App.setLoading(true)
    const taskId = e.target.name
    await App.todoList.toggleCompleted(taskId)
    window.location.reload()
  },

  login: async (e) => {
    //App.setLoading(true)
    const userCount = await App.user.userCount()
    var isLoged = false;

    const name = document.getElementById('name').value;
    const password = document.getElementById('password').value;
    for (var i = 1; i <= userCount; i++) {
      const user = await App.user.users(i)
      if(user[1] == name && user[2] == password ){
        await App.user.loginUser(name,password)
      
        login.hide()
        roomList.show()
        localStorage.setItem('user',name)
        window.location.reload()
        isLoged = true
        break;

      }

    

    }
    if(!isLoged){
      alert('Credentials are wrong')
    }

   
   
  },

  signup: async (e)=>{
    App.setLoading(true)
    const name = document.getElementById('name-s').value;
    const password = document.getElementById('password-s').value;
   
    await App.user.createUser(name,password)
    window.location.reload()

  },
    




  doReservation: async (e) => {
    App.setLoading(true)
    console.log(e.target.name)
    const taskId = e.target.name
    await App.todoList.doReservation(taskId)
    window.location.reload()
  },

  setLoading: (boolean) => {
    App.loading = boolean
    const loader = $('#loader')
    const content = $('#content')
    if (boolean) {
      loader.show()
      content.hide()
    } else {
      loader.hide()
      content.show()
    }
  }
}

$(() => {
  $(window).load(() => {
    App.load()
  })
})


function logout(){
  localStorage.removeItem('user')
  window.location.reload()
}

function showSignup(){
  console.log('clicked')
  signup.show()
  login.hide()
  roomList.hide()
  addForm.hide()

}