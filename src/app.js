
 const login = $('#login')
 const roomList = $('#room-list')
 const addForm = $('#add-form')
 const signup = $('#signup')
 const signupButton = $('#b-signup')
 const logoutButton = $('#b-logout')
 const rooms=$('#rooms')
 const roomTable=$('#table')






if(localStorage.getItem('user')){
  if(localStorage.getItem('user') == 'admin'){
    login.hide()
    signup.hide()
    roomList.show()
    addForm.show()
    signupButton.hide()
    rooms.hide()
    roomTable.show()
  }
  else{
    login.hide()
    roomList.show()
    signup.hide()
    signupButton.hide()
    rooms.show()
    roomTable.hide()
  }
  
}
else{
  login.show()
  roomList.hide()
  signup.hide()
  signupButton.show()
  logoutButton.hide()
  rooms.hide()
  roomTable.hide()

}



App = {
  loading: false,
  contracts: {},

  load: async () => {
    await App.loadWeb3()
    await App.loadAccount()
    await App.loadContract()
    await App.render()
    await App.getHotels()
    await renderUserReservations()
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

    
  },

  loadContract: async () => {
    // Create a JavaScript version of the smart contract
    const todoList = await $.getJSON('Contract.json')
    const user = await $.getJSON('User.json')
    const sideLowe = await $.getJSON('SideLowe.json')
    const arumBarut = await $.getJSON('ArumBarut.json')
    const xantheResort = await $.getJSON('XantheResort.json')


    App.contracts.TodoList = TruffleContract(todoList)
    App.contracts.User = TruffleContract(user)
    App.contracts.SideLowe = TruffleContract(sideLowe)
    App.contracts.ArumBarut = TruffleContract(arumBarut)
    App.contracts.XantheResort = TruffleContract(xantheResort)


    App.contracts.TodoList.setProvider(App.web3Provider)
    App.contracts.User.setProvider(App.web3Provider)
    App.contracts.SideLowe.setProvider(App.web3Provider)
    App.contracts.ArumBarut.setProvider(App.web3Provider)
    App.contracts.XantheResort.setProvider(App.web3Provider)



    // Hydrate the smart contract with values from the blockchain
    App.todoList = await App.contracts.TodoList.deployed()
    App.user = await App.contracts.User.deployed()
    App.sideLowe = await App.contracts.SideLowe.deployed()
    App.arumBarut = await App.contracts.ArumBarut.deployed()
    App.xantheResort = await App.contracts.XantheResort.deployed()


    console.log(App.sideLowe)

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
    const $taskTemplate = $('.taskTemplate')   
    const RIXOS_PREMIUM = App.todoList
    var roomCount = await RIXOS_PREMIUM.roomCount()
    var table = document.getElementById("tables");
    var header = table.createTHead();
    var row = header.insertRow(0);
    var cell = row.insertCell(0);
    var cell2 = row.insertCell(1);
    var cell3 = row.insertCell(2);
    row.style.backgroundColor='#000'
    cell.innerHTML="Hotel Name"
    cell2.innerHTML="Room Name"
    cell3.innerHTML="Count"

    table.style.color='white'
    document.getElementById("areaHotel").style.backgroundColor = "bisque";
    document.getElementById("areaHotel").style.borderRadius = "20px";
    document.getElementById("areaHotel").style.textAlign = "center";
    for (var i = 1; i <= roomCount; i++) {
      document.getElementById("hotelName").innerHTML = "Rixos HOTEL";
     
      console.log('for a girdi')
      // Fetch the task data from the blockchain
      
      const room = await App.todoList.rooms(i)
      const taskId = room[0].toNumber()
      const taskContent = room[1]
      const taskAllocation = room[2]
      document.getElementById("img").src="./assets/"+taskContent+".jpg"
      // Create the html for the task
      const $newTaskTemplate = $taskTemplate.clone()
      $newTaskTemplate.find('.content').html(taskContent)
      $newTaskTemplate.find('.allocation').html("Allocation : "+taskAllocation.toString())
      $newTaskTemplate.find('button')
                      .prop('name', taskId)
                      .prop('roomName', taskContent)
                      .prop('hotelName', await RIXOS_PREMIUM.hotelName())
                      .on('click',(e)=>{
                        doReservation(e,1)
                      } )
      $('#taskList').append($newTaskTemplate)
      //table for admin
      var row = table.insertRow();
      var cell1 = row.insertCell(0);
      var cell2 = row.insertCell(1);
      var cell3 = row.insertCell(2);
      cell1.innerHTML = 'Rixos Hotel';
      cell2.innerHTML = taskContent;
      cell3.innerHTML = taskAllocation  ;
      $newTaskTemplate.show()
    }

    const SIDE_LOWE = App.sideLowe
    var roomCount = await SIDE_LOWE.roomCount()
    for (var i = 1; i <= roomCount; i++) {
      document.getElementById("hotelName").innerHTML = "Löwe HOTEL";

      console.log('for a girdi')
      // Fetch the task data from the blockchain
      const room = await App.sideLowe.rooms(i)
      const taskId = room[0].toNumber()
      const taskContent = room[1]
      const taskAllocation = room[2]
      document.getElementById("img").src="./assets/"+taskContent+".jpg"

      // Create the html for the task
      const $newTaskTemplate = $taskTemplate.clone()
      $newTaskTemplate.find('.content').html(taskContent )
      $newTaskTemplate.find('.allocation').html("Allocation : "+taskAllocation.toString())
      $newTaskTemplate.find('button')
                      .prop('name', taskId)
                      .prop('roomName', taskContent)
                      .prop('hotelName', await SIDE_LOWE.hotelName())

                      .on('click',(e)=>{
                        doReservation(e,2)
                      } )

      $('#taskList').append($newTaskTemplate)
      var row = table.insertRow();
      var cell1 = row.insertCell(0);
      var cell2 = row.insertCell(1);
      var cell3 = row.insertCell(2);
      cell1.innerHTML = 'Löwe Hotel';
      cell2.innerHTML = taskContent;
      cell3.innerHTML = taskAllocation  ;
      $newTaskTemplate.show()
    }

    const ARUM_BARUT = App.arumBarut;
    var roomCount = await ARUM_BARUT.roomCount()
    for (var i = 1; i <= roomCount; i++) {
      document.getElementById("hotelName").innerHTML = "Arum HOTEL";
      console.log('for a girdi')
      // Fetch the task data from the blockchain
      
      const room = await App.arumBarut.rooms(i)
      const taskId = room[0].toNumber()
      const taskContent = room[1]
      const taskAllocation = room[2]
      document.getElementById("img").src="./assets/"+taskContent+".jpg"

      // Create the html for the task
      const $newTaskTemplate = $taskTemplate.clone()
      $newTaskTemplate.find('.content').html(taskContent)
      $newTaskTemplate.find('.allocation').html("Allocation : "+taskAllocation.toString())

      $newTaskTemplate.find('button')
                      .prop('name', taskId)
                      .prop('roomName', taskContent)
                      .prop('hotelName', await ARUM_BARUT.hotelName())

                      .on('click',(e)=>{
                        doReservation(e,3)
                      } )
      $('#taskList').append($newTaskTemplate)
      var row = table.insertRow();
      var cell1 = row.insertCell(0);
      var cell2 = row.insertCell(1);
      var cell3 = row.insertCell(2);
      cell1.innerHTML = 'Arum Hotel';
      cell2.innerHTML = taskContent;
      cell3.innerHTML = taskAllocation  ;
      $newTaskTemplate.show()
    }

    const XANTHE_RESORT = App.xantheResort
    var roomCount = await XANTHE_RESORT.roomCount()
    for (var i = 1; i <= roomCount; i++) {
      document.getElementById("hotelName").innerHTML = "Xanthe HOTEL";
      console.log('for a girdi')
      // Fetch the task data from the blockchain
      
      const room = await App.xantheResort.rooms(i)
      const taskId = room[0].toNumber()
      const taskContent = room[1]
      const taskAllocation = room[2]
      document.getElementById("img").src="./assets/"+taskContent+".jpg"

      // Create the html for the task
      const $newTaskTemplate = $taskTemplate.clone()
      $newTaskTemplate.find('.content').html(taskContent)
      $newTaskTemplate.find('.allocation').html("Allocation : "+taskAllocation.toString())

      $newTaskTemplate.find('button')
                      .prop('name', taskId)
                      .prop('roomName', taskContent)
                      .prop('hotelName', await XANTHE_RESORT.hotelName())

                      .on('click',(e)=>{
                        doReservation(e,4)
                      } )
      $('#taskList').append($newTaskTemplate)
      var row = table.insertRow();
      var cell1 = row.insertCell(0);
      var cell2 = row.insertCell(1);
      var cell3 = row.insertCell(2);
      cell1.innerHTML = 'Xanthe Hotel';
      cell2.innerHTML = taskContent;
      cell3.innerHTML = taskAllocation  ;
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
    const contract_id = parseInt($('#contract_id').val())

    console.log(content)
    console.log(accom)
    console.log('id',contract_id)

    console.log(contract_id == 2)

    switch (contract_id) {
      case 1:
        await App.todoList.createRoom(content,accom)

        break;


      case 2:
        console.log('case 2')
        await App.sideLowe.createRoom(content,accom)

        break;
    
      case 3:
        await App.arumBarut.createRoom(content,accom)

        break;
    
      case 4:
        await App.xantheResort.createRoom(content,accom)
        break;
          
    
      default:

        break;
    }



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

  getHotels: async (e)=>{
    console.log(await App.sideLowe.hotelName())
    console.log(await App.todoList.hotelName())
    console.log(await App.xantheResort.hotelName())
    console.log(await App.arumBarut.hotelName())

  },

  signup: async (e)=>{
    App.setLoading(true)
    const name = document.getElementById('name-s').value;
    const password = document.getElementById('password-s').value;
   
    await App.user.createUser(name,password)
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



async function doReservation(e,id){
  App.setLoading(true)
  console.log(e)
  const taskId = e.target.name
  const roomName = e.target.roomName
  const hotelName = e.target.hotelName

  
  switch (id) {
    case 1:
      await App.todoList.doReservation(taskId);
      break;

    case 2:
      await App.sideLowe.doReservation(taskId);

      break;

    case 3:
      await App.arumBarut.doReservation(taskId);

      break;

    case 4:
      await App.xantheResort.doReservation(taskId);

      break;

    default:
      break;
  }

  await App.user.saveReservation(roomName,hotelName)

  window.location.reload()
}

async function renderUserReservations(){
  const USER = App.user

  var resCount = await USER.reservationCount()
  for (var i = 1; i <= resCount; i++) {
    let reservation = await App.user.reservations(i)
    console.log(reservation)
   
  }
}