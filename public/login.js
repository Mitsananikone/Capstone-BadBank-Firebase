
var React = require('react');
var useState = require('react').useState;
var firebase = require('firebase/app', 'firebase/firestore');
// require('firestore/store');




function Login(){

  const [show, setShow]     = React.useState(true);
  const [status, setStatus] = React.useState('');    

  return (
    <Card
      bgcolor="secondary"
      header="Login"
      status={status}
      body={show ? 
        <LoginForm setShow={setShow} setStatus={setStatus}/> :
        <LoginMsg setShow={setShow} setStatus={setStatus}/>}
    />
  ) 
}

function LoginMsg(props){
  return(<>
    <h5>Success</h5>
    <button type="submit" 
      className="btn btn-light" 
      onClick={() => props.setShow(true)}>
        Authenticate again
    </button>
  </>);
}

function LoginForm(props){
  const [email, setEmail]       = React.useState('');
  const [password, setPassword] = React.useState('');

  const ctx = React.useContext(UserContext);  

  function handle() {
    const usersRef = firebase.firestore().collection('users');
    usersRef.where('email', '==', email)
      .get()
      .then((querySnapshot) => {
        if (querySnapshot.empty) {
          console.log('one');
          setStatus('fail!');
          return;
        }
        querySnapshot.forEach((doc) => {
          const user = doc.data();
          console.log(user);
          console.log(email, password);
          if (user.password === password) {
            console.log('two');
            setStatus('');
            setShow(false);
          } else {
            console.log('three');
            setStatus('fail!');
          }
        });
      })
      .catch((error) => {
        console.log('Error getting users:', error);
      });
  }
  
  return (<>

    Email<br/>
    <input type="input" 
      className="form-control" 
      placeholder="Enter email" 
      value={email} 
      onChange={e => setEmail(e.currentTarget.value)}/><br/>

    Password<br/>
    <input type="password" 
      className="form-control" 
      placeholder="Enter password" 
      value={password} 
      onChange={e => setPassword(e.currentTarget.value)}/><br/>

    <button type="submit" className="btn btn-light" onClick={handle}>Login</button>
   
  </>);
}

module.exports = Login;