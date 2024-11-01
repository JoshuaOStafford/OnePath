import React, { useState } from 'react';
import { View, StyleSheet, Alert, Dimensions } from 'react-native';
import { Button } from 'react-native-elements';
import Svg, { Circle, Line } from 'react-native-svg';

export default function GraphDisplay({ graph, pathEdges, onComplete, onReset, onQuit }) {
  const [selectedEdges, setSelectedEdges] = useState([]);
  const [lastNode, setLastNode] = useState(1); // Set initial lastNode as green node (Node 1)

  const { width, height } = Dimensions.get('window');
  const graphHeight = height * 0.8;

  const nodePositions = {
    1: { x: width * 0.3, y: graphHeight * 0.15 },
    2: { x: width * 0.7, y: graphHeight * 0.15 },
    3: { x: width * 0.9, y: graphHeight * 0.5 },
    4: { x: width * 0.7, y: graphHeight * 0.85 },
    5: { x: width * 0.3, y: graphHeight * 0.85 },
    6: { x: width * 0.1, y: graphHeight * 0.5 },
    7: { x: width * 0.65, y: graphHeight * 0.45 },
  };

  const handleNodeTap = (node) => {
    if (lastNode && !graph[lastNode].includes(node)) {
      Alert.alert("Invalid Move", "There's no path between these nodes.");
      return;
    }

    // Highlight the edge and update path
    setSelectedEdges([...selectedEdges, [lastNode, node]]);
    setLastNode(node);

    if (node === 5) {
      if (selectedEdges.length === pathEdges.length - 1) {
        onComplete();
      } else {
        Alert.alert("You must visit all dots between green and red");
        reset();
      }
    }
  };

  const reset = () => {
    setSelectedEdges([]);
    setLastNode(1); // Reset to green node
    if (onReset) onReset();
  };

  return (
    <View style={styles.container}>
      <Svg height="90%" width="100%">
        {/* Draw all edges */}
        {Object.entries(graph).map(([node, neighbors]) =>
          neighbors.map((neighbor) => {
            const pos1 = nodePositions[node];
            const pos2 = nodePositions[neighbor];

            if (pos1 && pos2) {
              const { x: x1, y: y1 } = pos1;
              const { x: x2, y: y2 } = pos2;

              return (
                <Line
                  key={`${node}-${neighbor}`}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke={
                    selectedEdges.some(
                      (edge) =>
                        (edge[0] === parseInt(node) && edge[1] === neighbor) ||
                        (edge[1] === parseInt(node) && edge[0] === neighbor)
                    )
                      ? "gold"
                      : "gray"
                  }
                  strokeWidth={
                    selectedEdges.some(
                      (edge) =>
                        (edge[0] === parseInt(node) && edge[1] === neighbor) ||
                        (edge[1] === parseInt(node) && edge[0] === neighbor)
                    )
                      ? "4"
                      : "2"
                  }
                />
              );
            }
            return null;
          })
        )}

        {/* Draw nodes */}
        {Object.keys(nodePositions).map((node) => (
          <Circle
            key={node}
            cx={nodePositions[node].x}
            cy={nodePositions[node].y}
            r="15"
            fill={
              node === "1" ? "green" :
              node === "5" ? "red" :   
              "skyblue"
            }
            onPress={() => handleNodeTap(parseInt(node))}
          />
        ))}
      </Svg>
      
      <View style={styles.buttonContainer}>
        <View style={styles.buttonWrapper}>
          <Button 
            title="Reset" 
            onPress={reset} 
            buttonStyle={styles.buttonReset}
            titleStyle={styles.buttonTitle}
          />
        </View>
        <View style={styles.buttonWrapper}>
          <Button 
            title="Quit" 
            onPress={onQuit} 
            buttonStyle={styles.buttonQuit}
            titleStyle={styles.buttonTitle}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#f8f8f8',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: '5%',
    width: '100%',
  },
  buttonWrapper: {
    width: '40%',
  },
  buttonReset: {
    backgroundColor: 'gray',
    borderRadius: 10,
    padding: 10,
  },
  buttonQuit: {
    backgroundColor: 'red',
    borderRadius: 10,
    padding: 10,
  },
  buttonTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});