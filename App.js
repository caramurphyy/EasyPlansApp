import { React, useState, useEffect } from 'react';
import { ImageBackground, Image, Modal, FlatList, SafeAreaView, StyleSheet, View, TouchableOpacity, Text, TextInput, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createStore } from 'state-pool';

const store = createStore();
store.setState('ideaList', []);
store.setState('nameList', []);


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

const DismissKeyboard = ({ children }) => (
  <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
    {children}
  </TouchableWithoutFeedback>
);

const StartScreen = ({ navigation }) => {

  const [nameModalVisible, setNameModalVisible] = useState(true);
  const [name, setName] = useState('');
  const [nameList, setNameList] = store.useState("nameList");

  function updateNames(name) {
    setNameList([...nameList, { Name: name, Voted: [] }]);
    setNameModalVisible(!nameModalVisible);
  }

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground source={require('./assets/conspireStartBackground.png')} resizeMode='cover' style={styles.bgImage}>
        <View style={styles.logoContainer}>
          <Image source={require('./assets/conspireLogo.png')} style={styles.logoImage} />
          <Text style={styles.logoText}>conspire</Text>
        </View>
        <Image source={require('./assets/homeImage.png')} style={styles.image} />
        <View style={styles.addContainer}>
          <TouchableOpacity style={styles.button} onPress={() =>
            navigation.navigate('AddIdeaScreen')}>
            <Text style={styles.text}>Add Idea</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.voteContainer}>
          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('VoteScreen')}>
            <Text style={styles.text}>Vote</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>

      <Modal
        animationType="none"
        transparent={true}
        visible={nameModalVisible}
        onRequestClose={() => {
          setNameoModalVisible(!nameModalVisible);
        }}
      >
        <SafeAreaView style={styles.modalContainer}>
          <SafeAreaView style={styles.modalContent}>
            <Text style={styles.modalHeading}>Enter Name</Text>
            <TextInput
              style={styles.input}
              onChangeText={setName}
              multiline={true}
              value={name}
            />
            <TouchableOpacity
              style={[styles.addProButton]}
              onPress={() => updateNames(name)}
            >
              <Text style={styles.addProButtonText}>Enter</Text>
            </TouchableOpacity>
          </SafeAreaView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView >


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

    <ImageBackground source={require('./assets/AddIdeaBG.png')} resizeMode='cover' style={styles.bgImage}>
      <DismissKeyboard>
        <SafeAreaView style={styles.addIdeaContainer}>
          <Image source={require('./assets/chat.png')} />
          <Text style={styles.addIdeaHeader}>Add Idea</Text>
          <TextInput
            style={styles.input}
            onChangeText={onChangeTitle}
            multiline={true}
            value={title}
            placeholder="Title"
            placeholderTextColor={'white'}
          />
          <TextInput
            style={styles.descInput}
            onChangeText={onChangeDesc}
            multiline={true}
            value={desc}
            placeholder="Description"
            placeholderTextColor={'white'}
          />
          <TouchableOpacity style={styles.button} onPress={handleAdd}>
            <Text style={styles.text}>Add</Text>
          </TouchableOpacity>
        </SafeAreaView >
      </DismissKeyboard>
    </ImageBackground>


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

    <ImageBackground source={require('./assets/VotingBG.png')} resizeMode='cover' style={styles.bgImage}>
      <SafeAreaView style={styles.votingPage}>

        <TouchableOpacity style={styles.button} onPress={() =>
          navigation.navigate('ResultScreen')}><Text style={styles.buttonText}>Done?</Text></TouchableOpacity>
        <FlatList
          data={ideaList}
          extraData={ideaList}
          renderItem={({ item }) => (<View style={styles.votingContainer}>
            <TouchableOpacity style={styles.upvoteButton} onPress={() => updateUpvotes(item.ideaTitle)}>
              <Text style={styles.voteCount}>▲{item.upvotes}</Text>
            </TouchableOpacity>


            <Text style={styles.ideaHeading}>{item.ideaTitle}</Text>
            <Text style={styles.ideaDescription}>{item.ideaDesc}</Text>


            <SafeAreaView style={styles.addProConButtonsContainer}>
              <TouchableOpacity style={styles.proButton} onPress={() => handleAddPro(item.ideaTitle)}>
                <Text style={styles.proConButtonText}>Add Pro</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.conButton} onPress={() => handleAddCon(item.ideaTitle)}>
                <Text style={styles.proConButtonText}>Add Con</Text>
              </TouchableOpacity>
            </SafeAreaView>

            <SafeAreaView style={styles.proconContainer}>
              <SafeAreaView style={styles.proconListContainer}>
                <Text style={styles.prosHeading}>Pros</Text>
                <FlatList
                  data={item.pros}
                  renderItem={({ item }) => (<View>
                    <Text style={styles.proText}>{item}</Text></View>)}
                  keyExtractor={(item) => item.id}
                /></SafeAreaView>
              <SafeAreaView style={styles.proconListContainer}>
                <Text style={styles.consHeading}>Cons</Text>
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
    </ImageBackground>

  );
}

const ResultScreen = ({ navigation }) => {
  const [ideaList, setList] = store.useState("ideaList");
  const result = ideaList[0];
  const [nameList, setNameList] = store.useState("nameList");

  const reset = () => {
    setNameList([]);
    setList([]);
    navigation.navigate('StartScreen')
  }

  return (
    <SafeAreaView style={styles.resultContainer}>
      <Text style={styles.resultText}>{result.ideaTitle} wins!</Text>
      <TouchableOpacity style={styles.button} onPress={reset}>
        <Text style={styles.buttonText}>Restart</Text>
      </TouchableOpacity>
    </SafeAreaView>);
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoImage: {
    marginTop: 10,
    marginLeft: 10,
    marginBottom: 10,
    marginRight: 5,
    width: 25,
    height: 25,
  },
  logoText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 10
  },
  bgImage: {
    width: '100%',
    height: '105%',
    flex: 1,
  },
  startHeading: {
    color: 'black',
    fontSize: 28,
    letterSpacing: 2

  },
  image: {
    marginTop: 150,
    marginLeft: 100,
    width: 300,
    height: 300,
  },
  addContainer: {
    paddingHorizontal: 100,
    paddingVertical: 40,
  },
  addIdeaContainer: {
    flex: 1,
    paddingVertical: 155,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addIdeaHeader: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#142651',
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    backgroundColor: '#e9607c',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold'
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
    color: '#0c2570',
  },
  input: {
    borderWidth: 1,
    borderRadius: 4,
    textAlign: 'center',
    width: 300,
    padding: 10,
    marginVertical: 10,
    backgroundColor: '#0c2570',
    color: 'white',
  },
  descInput: {
    borderRadius: 4,
    borderWidth: 1,
    textAlign: 'center',
    width: 300,
    height: 150,
    padding: 10,
    marginVertical: 10,
    marginBottom: 15,
    backgroundColor: '#0c2570',
    color: 'white',
  },
  votingPage: {
    marginTop: 20,
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
  },
  votingPageHeader: {
    fontSize: 28,
    padding: 10,
  },
  votingContainer: {
    borderRadius: 4,
    backgroundColor: '#0c2570',
    width: 350,
    padding: 20,
    margin: 10,
  },
  upvoteButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    backgroundColor: '#0c2570',
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
    fontWeight: 'bold',
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
    backgroundColor: '#7DA4F1',
  },
  conButton: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    backgroundColor: '#e9607c',
  },
  proConButtonText: {
    color: 'white',
    fontWeight: 'bold'
  },
  proconContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: 10
  },
  proconListContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    flex: 1
  },
  consHeading: {
    letterSpacing: 2,
    color: '#e9607c',
    fontSize: 20,
    marginBottom: 5,
    fontWeight: 'bold'
  },
  prosHeading: {
    letterSpacing: 2,
    color: '#7DA4F1',
    fontSize: 20,
    marginBottom: 5,
    fontWeight: 'bold'
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
    borderRadius: 4,
    borderColor: 'white',
    borderWidth: 5,
    backgroundColor: '#709fff',
    width: 350,
    height: 300,
    alignItems: "center",
  },
  modalHeading: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 20,
    marginTop: 10
  },
  addProButton: {
    width: 150,
    backgroundColor: '#e9607c',
    padding: 10,
    borderRadius: 4

  },
  addProButtonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold'
  },
  resultContainer: {

    flexDirection: 'column',
    alignItems: 'center',
  },
  resultText: {
    margin: 50,
    padding: 20,
    fontSize: 20,
    backgroundColor: '#0c2570',
    borderColor: '#e9607c',
    borderWidth: 5,
    color: 'white',
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




