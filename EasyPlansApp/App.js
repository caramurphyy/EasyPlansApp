import { React, useState, useEffect } from 'react';
import { Image, Modal, FlatList, SafeAreaView, StyleSheet, View, TouchableOpacity, Text, TextInput } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createStore } from 'state-pool';

const store = createStore();
store.setState('ideaList', [{ ideaTitle: "test", ideaDesc: " test", upvotes: 0, downvotes: 0, pros: ["pro1", "pro2"], cons: [] }, { ideaTitle: "eart", ideaDesc: " test", upvotes: 2, downvotes: 0, pros: ["bruh"], cons: [] }]);


const Stack = createNativeStackNavigator();

const MyStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="StartScreen"
        component={StartScreen}
      />
      <Stack.Screen name="AddIdeaScreen" component={AddIdeaScreen} />
      <Stack.Screen name="VoteScreen" component={VoteScreen} />
      <Stack.Screen name="ResultScreen" component={ResultScreen} />
    </Stack.Navigator>
  );
};

const StartScreen = ({ navigation }) => {

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.startHeading}>EasyPlans</Text>
      <View style={styles.addContainer}>
        <TouchableOpacity style={styles.button} onPress={() =>
          navigation.navigate('AddIdeaScreen')}>
          <Text style={styles.text}>add Idea</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.voteContainer}>
        <Image source={require('./assets/like.png')} />;
        <Text style={styles.doneText}>done adding ideas?</Text>

        <TouchableOpacity style={styles.button} onPress={() =>
          navigation.navigate('VoteScreen')}>
          <Text style={styles.text}>vote</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const AddIdeaScreen = ({ navigation }) => {
  const [ideaList, setList] = store.useState("ideaList");
  const [title, onChangeTitle] = useState("");
  const [desc, onChangeDesc] = useState("");


  const handleAdd = () => {
    setList([...ideaList, { ideaTitle: title, ideaDesc: desc, upvotes: 0, downvotes: 0, pros: [], cons: [] }]);
    navigation.navigate('StartScreen')
  }

  return (
    <SafeAreaView style={styles.addIdeaContainer}>
      <Text>Add Idea</Text>
      <TextInput
        style={styles.input}
        onChangeText={onChangeTitle}
        value={title}
        placeholder="title"
      />
      <TextInput
        style={styles.input}
        onChangeText={onChangeDesc}
        multiline={true}
        value={desc}
        placeholder="description"
      />
      <TouchableOpacity style={styles.button} onPress={handleAdd}>
        <Text style={styles.text}>add</Text>
      </TouchableOpacity>

    </SafeAreaView >
  );
};


const VoteScreen = ({ navigation }) => {
  const [ideaList, setList] = store.useState("ideaList");
  const [upvoted, setUpvoted] = useState(true);
  const [upvotedIdea, setUpvotedIdea] = useState("");


  const [proModalVisible, setProModalVisible] = useState(false);
  const [addedPro, setAddedPro] = useState(true);
  const [addedProConIdea, setAddedProConIdea] = useState("");
  const [pro, setPro] = useState("");

  const [conModalVisible, setConModalVisible] = useState(false);
  const [addedCon, setAddedCon] = useState(true);
  const [con, setCon] = useState("");


  function updateUpvotes(title) {
    setUpvotedIdea(title);
    setUpvoted(!upvoted);
  }

  function handleAddPro(title) {
    setAddedProConIdea(title);
    setProModalVisible(!proModalVisible);
  }
  function handleAddCon(title) {
    setAddedProConIdea(title);
    setConModalVisible(!conModalVisible);
  }

  function addPro() {
    setAddedPro(!addedPro);
    setProModalVisible(!proModalVisible);
  }

  function addCon() {
    setAddedCon(!addedCon);
    setConModalVisible(!conModalVisible);
  }

  useEffect(() => {
    const newList = ideaList.map((item) => {
      if (item.ideaTitle === addedProConIdea) {
        const updatedItem = {
          ...item,
          pros: [...item.pros, pro],
        };
        return updatedItem;
      } else {
        return item;
      }
    });
    setList(newList);
    setPro("");
  },
    [addedPro]
  );

  useEffect(() => {
    const newList = ideaList.map((item) => {
      if (item.ideaTitle === addedProConIdea) {
        const updatedItem = {
          ...item,
          cons: [...item.cons, con],
        };
        return updatedItem;
      } else {
        return item;
      }
    });
    setList(newList);
    setCon("");
  },
    [addedCon]
  );


  useEffect(() => {
    const newList = ideaList.map((item) => {
      if (item.ideaTitle === upvotedIdea) {
        const updatedItem = {
          ...item,
          upvotes: item.upvotes + 1,
        };
        return updatedItem;
      } else {
        return item;
      }
    });

    const sortedList = [...newList].sort((a, b) => { return (parseInt(b.upvotes) - parseInt(a.upvotes)) });
    setList(sortedList);
  },
    [upvoted]
  );


  return (
    <SafeAreaView style={styles.votingPage}>
      <Text style={styles.votingPageHeader}>Vote!</Text>
      <TouchableOpacity style={styles.button} onPress={() =>
        navigation.navigate('ResultScreen')}><Text style={styles.buttonText}>done voting?</Text></TouchableOpacity>
      <FlatList
        data={ideaList}
        extraData={ideaList}
        renderItem={({ item }) => (<View style={styles.votingContainer}>
          <TouchableOpacity style={styles.button} onPress={() => updateUpvotes(item.ideaTitle)}>
            <Text style={styles.voteCount}>▲ {item.upvotes}</Text>
          </TouchableOpacity>


          <Text style={styles.ideaHeading}>{item.ideaTitle}</Text>
          <Text style={styles.ideaDescription}>{item.ideaDesc}</Text>


          <SafeAreaView style={styles.addProConButtonsContainer}>
            <TouchableOpacity style={styles.proButton} onPress={() => handleAddPro(item.ideaTitle)}>
              <Text style={styles.proConButtonText}>add pro</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.conButton} onPress={() => handleAddCon(item.ideaTitle)}>
              <Text style={styles.proConButtonText}>add con</Text>
            </TouchableOpacity>
          </SafeAreaView>

          <SafeAreaView style={styles.proconContainer}>
            <SafeAreaView style={styles.proconListContainer}>
              <Text style={styles.prosHeading}>pros</Text>
              <FlatList
                data={item.pros}
                renderItem={({ item }) => (<View>
                  <Text style={styles.proText}>{item}</Text></View>)}
                keyExtractor={(item) => item.id}
              /></SafeAreaView>
            <SafeAreaView style={styles.proconListContainer}>
              <Text style={styles.consHeading}>cons</Text>
              <FlatList
                data={item.cons}
                renderItem={({ item }) => (<View>
                  <Text style={styles.proText}>{item}</Text></View>)}
                keyExtractor={(item) => item.id}
              /></SafeAreaView>
          </SafeAreaView>

          <Modal
            animationType="none"
            transparent={true}
            visible={proModalVisible}
            onRequestClose={() => {
              setProModalVisible(!proModalVisible);
            }}
          >
            <SafeAreaView style={styles.modalContainer}>
              <SafeAreaView style={styles.modalContent}>
                <Text style={styles.modalHeading}>Add Pro</Text>
                <TextInput
                  style={styles.input}
                  onChangeText={setPro}
                  multiline={true}
                  value={pro}
                />
                <TouchableOpacity
                  style={[styles.addProButton]}
                  onPress={() => addPro(item.ideaTitle)}
                >
                  <Text style={styles.addProButtonText}>Add</Text>
                </TouchableOpacity>
              </SafeAreaView>
            </SafeAreaView>
          </Modal>

          <Modal
            animationType="none"
            transparent={true}
            visible={conModalVisible}
            onRequestClose={() => {
              setConModalVisible(!conModalVisible);
            }}
          >
            <SafeAreaView style={styles.modalContainer}>
              <SafeAreaView style={styles.modalContent}>
                <Text style={styles.modalHeading}>Add Con</Text>
                <TextInput
                  style={styles.input}
                  onChangeText={setCon}
                  multiline={true}
                  value={con}
                />
                <TouchableOpacity
                  style={[styles.addProButton]}
                  onPress={() => addCon(item.ideaTitle)}
                >
                  <Text style={styles.addProButtonText}>Add</Text>
                </TouchableOpacity>
              </SafeAreaView>
            </SafeAreaView>
          </Modal>

        </View>)
        }
        keyExtractor={(item) => item.ideaTitle}
      />
    </SafeAreaView >
  );
}

const ResultScreen = ({ navigation }) => {
  const [ideaList, setList] = store.useState("ideaList");
  const result = ideaList[0];

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.resultText}>{result.ideaTitle} wins!</Text>
    </SafeAreaView>);
}


const styles = StyleSheet.create({
  container: {
    paddingVertical: 105,
    flex: 1,
    backgroundColor: '#fff',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  startHeading: {
    color: 'black',
    fontSize: 28,
    letterSpacing: 2

  },
  addContainer: {
    paddingVertical: 225,
  },
  addIdeaContainer: {
    flex: 1,
    paddingVertical: 225,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: 'black',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  text: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: 'white',
  },
  voteContainer: {
    justifyContent: "flex-end",
    alignItems: 'center',
  },
  doneText: {
    marginVertical: 10,
    fontSize: 16,
    lineHeight: 21,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: 'black',
  },
  input: {
    borderWidth: 1,
    textAlign: 'center',
    width: 200,
    padding: 10,
    marginVertical: 10,
  },
  votingPage: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
  },
  votingPageHeader: {
    fontSize: 28,
    padding: 10,
  },
  votingContainer: {
    backgroundColor: 'black',
    width: 350,
    padding: 20,
    margin: 10,
  },
  ideaHeading: {
    color: 'white',
    fontSize: 24,
    textAlign: 'center',
  },
  ideaDescription: {
    color: 'white',
    marginBottom: 20,
  },
  voteCount: {
    color: 'white',
  },
  addProConButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',

  },
  proButton: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    backgroundColor: 'green',
  },
  conButton: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    backgroundColor: 'red',
  },
  proConButtonText: {
    color: 'white'
  },
  proconContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: 10
  },
  proconListContainer: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  consHeading: {
    letterSpacing: 2,
    color: 'red',
    fontSize: 20,
    marginBottom: 5
  },
  prosHeading: {
    letterSpacing: 2,
    color: 'green',
    fontSize: 20,
    marginBottom: 5
  },
  proText: {
    color: 'white'
  },
  modalContainer: {
    flex: 1,
    height: 300,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: 'white',
    width: 350,
    height: 300,
    alignItems: "center",
  },
  modalHeading: {
    color: 'black',
    textAlign: 'center',
    fontSize: 20,
  },
  addProButton: {
    width: 150,
    backgroundColor: 'black',
    padding: 10
  },
  addProButtonText: {
    color: 'white',
    textAlign: 'center',
  },
  resultText: {
    color: 'black',
  }


});


const App = () => {
  return (
    <NavigationContainer>
      <MyStack />
    </NavigationContainer>
  );
};

export default App;




