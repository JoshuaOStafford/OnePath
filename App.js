import React, { useEffect, useState } from 'react';
import { View, Text, Alert, StyleSheet } from 'react-native';
import { Button } from 'react-native-elements';

import { generateHamiltonianGraph } from './utils/graphUtils';
import GraphDisplay from './components/GraphDisplay';

export default function App() {
  const [graphData, setGraphData] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [time, setTime] = useState(0);
  

  const generateNewGraph = () => {
    const { graph, pathEdges } = generateHamiltonianGraph(7, 80);
    setGraphData({ graph, pathEdges });
  };

  useEffect(() => {
    generateNewGraph(); // Generate initial graph data on load
  }, []);

  useEffect(() => {
    let intervalId;
    if (isPlaying) {
      intervalId = setInterval(() => {
        const currentTime = Date.now();
        const elapsedTime = Math.floor((currentTime - startTime) / 1000);
        setTime(elapsedTime);
      }, 1000);
    }
    return () => {
      clearInterval(intervalId);
    };
  }, [isPlaying, startTime]);

  const startGame = () => {
    generateNewGraph(); // Generate a new graph each time Play is pressed
    setIsPlaying(true);
    setStartTime(Date.now()); // Record the start time
  };

  const handleComplete = () => {
    setIsPlaying(false); // End the game
    const endTime = Date.now();
    const timeTaken = Math.floor((endTime - startTime) / 1000); // Calculate time in seconds
    Alert.alert("Congratulations!", `You found the One Path in ${time} seconds!`);
    setTime(0);
  };

  const showInstructions = () => {
    Alert.alert(
      "Instructions:",
      `
Find the one path by pressing each dot in the right order, starting at the green dot and ending at the red dot as fast as you can!  Visit each dot only once.
`
    );
  };

  const handleQuit = () => {
    setTime(0);
    setIsPlaying(false); // Return to the start screen
  };

  if (!graphData) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {!isPlaying ? (
        <View style={styles.startContainer}>
          <Text style={styles.title}>Welcome to OnePath!</Text>
          <Button
            title="Instructions"
            onPress={showInstructions}
            buttonStyle={styles.buttonInstructions}
            titleStyle={styles.buttonTitle}
          />
          <Button
            title="Play"
            onPress={startGame}
            buttonStyle={styles.buttonPlay}
            titleStyle={styles.buttonTitle}
          />
        </View>
      ) : (
        <View style={{ flex: 1, flexDirection: 'column'}}>
          <Text style={{ fontSize: 36, textAlign: 'center', paddingTop: '5%' }}>{time}s</Text>
          <View style={{ flex: 1}}>
          <GraphDisplay
          graph={graphData.graph}
          pathEdges={graphData.pathEdges}
          onComplete={handleComplete}
          onQuit={handleQuit} // Pass quit handler to GraphDisplay
        />       
         </View>
      </View>
        
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  startContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 36,
    marginBottom: 10,
  },
  instructions: {
    fontSize: 16,
    paddingVertical: 8,
    paddingHorizontal: 8,
    marginBottom: 10,
  },
  buttonInstructions: {
    backgroundColor: 'gray',
    borderRadius: 10,
    padding: 10,
    margin: 10,
  },
  buttonPlay: {
    backgroundColor: '#34C759',
    borderRadius: 10,
    padding: 10,
    margin: 10,
  },
  buttonTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});