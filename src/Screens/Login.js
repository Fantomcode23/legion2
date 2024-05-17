import React, { useState, useEffect } from "react";
import axios from 'axios';

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  ScrollView,
} from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome';
import { storeAccessToken } from './auth';
import { uri } from "../../globalvariable/globalvariable";




const Login = ({ navigation }) => {
  const [userResp, setUserResp] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);


  // handel user login
  const handleLogin = async () => {
    // try {
    //   const response = await axios.post(`${uri}/auth/login`, {
    //     name: username, // Assuming username is the email
    //     password: password,
    //   });
    //   // If login is successful, store the access token and navigate to the next screen
    //   const accessToken = response.data.access_token;
    //   await storeAccessToken(accessToken);
    //   navigation.navigate('Parent');
    // } catch (error) {
    //   // If login fails, display an error message
    //   console.error('Login failed:', error.response.data.error);
    //   setUserResp(error.response.data.error);
    // }
      navigation.navigate('Parent');
  };
  // handel forgot password
  const handleForgotPassword = () => {
    navigation.navigate("forgetpassword");
  };
  // toggle pasword visibility
  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };
  // redirect to register page
  const handleSignup = () => {
    navigation.navigate("Signup");
  };
  

  return (
      
      <ScrollView keyboardShouldPersistTaps="handled" backgroundColor="black">
        <View style={styles.container}>
          <ImageBackground
            source={require("../Images/Login2.webp")}
            style={styles.image}
          >
          </ImageBackground>
          <Text style={styles.heading}>
            --CYBER BUDDY--
          </Text>

          <View style={{width:350,alignItems:'center'}}>
      <View style={styles.inputContainer}>
        <Icon name="user" size={20} color="#808080" style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          placeholder="Username"
          placeholderTextColor={"#808080"}
          onChangeText={(text) => setUsername(text)}
          value={username}
        />
      </View>
      <View style={styles.inputContainer}>
        <Icon name="lock" size={20} color="#808080" style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor={"#808080"}
          onChangeText={(text) => setPassword(text)}
          value={password}
          secureTextEntry={!isPasswordVisible}
        />
        <TouchableOpacity onPress={togglePasswordVisibility}>
          <Icon
            name={isPasswordVisible ? 'eye-slash' : 'eye'}
            size={20}
            color="#808080"
            style={styles.passwordIcon}
          />
        </TouchableOpacity>
      </View>
    </View>
          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.LoginbuttonText}>Login</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleForgotPassword}>
            <Text style={styles.forgotPassword}>
              Forgot Password? Click here
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleSignup}>
            <Text style={[styles.forgotPassword,{marginTop:10}]}>
              New User? Click here
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
   
  );
};

const styles = StyleSheet.create({
  image: {
    flex: 1,
    justifyContent: "center",
    height: 450,
    width: 500,
    flexWrap: "wrap",
  },
  heading: {
    marginTop:10,
    fontSize:36,
    marginBottom:30,
    fontWeight:"bold",
    color:"white",
    marginTop:-50
  },
  root: {
    paddingBottom: 150,
    shadowColor: "black",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.5,
    shadowRadius: 6.84,
    elevation: 50,
  },
  logo: {
    width: 200,
    height: 200,
    marginLeft: 150,
    borderColor: "black",
    borderRadius: 100,
   
    top:250,
    

    
  },
  container: {
    flex: 1,
    alignItems: "center",
    marginBottom: 100,
    backgroundColor:"black"
  },
  LoginbuttonText: {
    color: "black",
    fontSize: 18,
    textAlign:'center',
    justifyContent:"center",
    alignContent:"center"
  },
  button: {
    backgroundColor: "white",
    padding: 10,
    borderRadius: 10,
    borderColor: "black",
    borderWidth: 1,
    marginTop:50,
    width:200
  },
  
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'white',
    marginBottom: 20,
    width:350,
    
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 40,
    fontSize: 16,
    color: 'white',
  },
  forgotPassword:{
    color:"white"
  }

});

export default Login;