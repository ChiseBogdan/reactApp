// export const apiUrl = '172.30.116.55:8080';
export const apiUrl = '192.168.0.104:8080';
export const httpApiUrl = `http://${apiUrl}`;
export const headers = {
  'Accept': 'application/json',
  'Content-Type': 'application/json'
};


export const login = (username, password) =>{

  const response  = fetch(httpApiUrl + '/login', {

      method: 'POST',
      headers: {'content-type': 'application/json'},
      body: JSON.stringify({username: username, password: password})
  
  })
  .then(data => {

      const {status} = data

      if(status == 200){
        const {headers} = data
        const authorization = headers.map.authorization
        return authorization
      }

      console.log("HERE")
      throw new Error("Invalid username or password")     
      
      
  })
  .catch(error => {
      throw new Error(error)
  }); 

  return response

}