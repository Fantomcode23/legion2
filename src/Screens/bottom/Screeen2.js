import React, { useState } from "react";
import {
  View,
  TextInput,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import MaskedView from "@react-native-masked-view/masked-view";
import axios from "axios";
import { uri } from "../../../globalvariable/globalvariable";
import { Feather } from "@expo/vector-icons";
import { useEffect } from "react";

const Scanner = ({ navigation }) => {
  const handleUrlChange = (text) => {
    setUrl(text);
  };

  const handleButtonClick = () => {
    getVulnerability();
  };

  const [url, setUrl] = useState("");
  const [vulnerabilities, setVulnerabilities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(300); // 300 seconds = 5 minutes
  const [timerRunning, setTimerRunning] = useState(false);

  useEffect(() => {
    let interval;
    if (timerRunning) {
      interval = setInterval(() => {
        if (countdown > 0) {
          setCountdown((prevCountdown) => prevCountdown - 1);
        } else {
          setTimerRunning(false);
          clearInterval(interval);
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [countdown, timerRunning]);

  const getVulnerability = async () => {
    setTimerRunning(true);
    setLoading(true);
    try {
      setLoading(true);
      const resp = await axios.post(`${uri}/check_url/`, {
        url: url,
      });
      const response = resp.data;
      console.log(response);
      if (Array.isArray(response)) {
        setVulnerabilities(response);
      } else {
        const result = [resp.data];
        setVulnerabilities(result);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleVulnerabilityPress = (vulnerability) => {
    Alert.alert(
      "Vulnerability Details",
      `${vulnerability}`,
      [
        { text: "OK", onPress: () => console.log("OK Pressed") },
        {
          text: "Details",
          onPress: () =>
            navigation.navigate("Details", {
              vulnerabilityName: vulnerability,
            }),
        },
      ],
      { cancelable: false }
    );
  };

  const handleClear = () => {
    setUrl("");
    setVulnerabilities([]);
    setCountdown(300); 
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => {
            navigation.openDrawer();
          }}
        >
          <Ionicons name="menu" size={24} style={styles.headerMenuIcon} />
        </TouchableOpacity>
        <MaskedView
          maskElement={
            <Text
              style={[styles.headerTitle, { backgroundColor: "transparent" }]}
            >
              Scanner
            </Text>
          }
        >
          <LinearGradient
            colors={["red", "black"]}
            start={[0.5, 0]}
            end={[1, 1]}
            style={styles.yellowHeader}
          >
            <Text style={[styles.headerTitle, { opacity: 0 }]}>Scanner</Text>
          </LinearGradient>
        </MaskedView>
      </View>

      <TextInput
        style={styles.input}
        placeholder="Enter website URL"
        onChangeText={handleUrlChange}
        value={url}
      />

      <TouchableOpacity onPress={handleButtonClick} style={styles.scan}>
        <Text style={{ color: "white", textAlign: "center", fontSize: 20 }}>
          Scan
        </Text>
      </TouchableOpacity>
      <ScrollView>
        {timerRunning ? (
          <View style={styles.timerContainer}>
            <Text style={styles.timerText}>
              Scanning in process: {Math.floor(countdown / 60)}:{(countdown % 60).toString().padStart(2, '0')} Min
            </Text>
          </View>
        ) : (
          loading ? (
            <ActivityIndicator size="large" color="blue" />
          ) : (
            vulnerabilities.map((vulnerability, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => handleVulnerabilityPress(vulnerability)}
                style={styles.vulnerabilityBlock}
              >
                <View style={styles.vulnerabilityContainer}>
                  <Text
                    numberOfLines={1}
                    ellipsizeMode="tail"
                    style={styles.vulnerabilityText}
                  >
                    {vulnerability.length > 20
                      ? vulnerability.substring(0, 30) + "..."
                      : vulnerability}
                  </Text>
                  <Feather
                    name="eye"
                    size={20}
                    color="black"
                    onPress={() =>
                      navigation.navigate("Details", {
                        vulnerabilityName: vulnerability,
                      })
                    }
                  />
                </View>
              </TouchableOpacity>
            ))
          )
        )}

        {vulnerabilities.length > 0 && !timerRunning && (
          <>
            <TouchableOpacity onPress={handleClear} style={styles.clear}>
              <Text
                style={{ color: "white", textAlign: "center", fontSize: 20 }}
              >
                Clear
              </Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 10,
    height: 70,
    backgroundColor: "#fff",
    elevation: 50,
  },
  headerTitle: {
    fontSize: 30,
    color: "#000",
    marginTop: 18,
    paddingLeft: 70,
  },
  headerMenuIcon: {
    color: "#000",
    top: 10,
    marginLeft: 20,
  },
  yellowHeader: {
    textAlign: "center",
    marginTop: -5,
    marginRight: 130,
  },

  input: {
    height: 40,
    marginBottom: 10,
    borderColor: "gray",
    borderWidth: 1,
    marginTop: 25,
    width: 300,
    alignSelf: "center",
    padding: 5,
    borderRadius: 10,
  },
  scan: {
    backgroundColor: "black",
    width: 100,
    borderRadius: 20,
    alignSelf: "center",
    padding: 5,
    height: 40,
    marginBottom: 10,
  },
  vulnerabilitiesContainer: {
    marginTop: 20,
    marginLeft: 10,
  },
  vulnerabilitiesTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  vulnerabilityItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "lightgray",
  },
  vulnerabilityTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  vulnerabilityContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
    borderRadius: 10,
    // Add any other common styles for each vulnerability container
  },
  clear: {
    backgroundColor: "black",
    width: 200,
    borderRadius: 20,
    alignSelf: "center",
    padding: 5,
    height: 40,
    marginBottom: 20,
  },
  vulnerabilityBlock: {
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    marginLeft: 10,
    marginRight: 10,
  },
  vulnerabilityText: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  timerContainer:{
  flex:1,
  alignSelf:"center"
  },
  timerText: {
    fontSize: 26,
    color:"green"
  }
});

export default Scanner;
