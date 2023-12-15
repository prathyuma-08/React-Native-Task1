import { StyleSheet, View, Dimensions, Animated, PanResponder } from 'react-native';
import { useState} from 'react';
import { Entypo,Ionicons } from '@expo/vector-icons';

const SCREEN_HEIGHT = Dimensions.get('window').height
const SCREEN_WEIGHT = Dimensions.get('window').width

const colors = [
  { id: "1", color: "#92ccf2" },
  { id: "2", color: "#80e6bb" },
  { id: "3", color: "#fbd68a" },
  { id: "4", color: "#e89b6e" },
  { id: "5", color: "#d06368" },  
]

export default function App() {

  const position = new Animated.ValueXY();
  const [currentIndex, setCurrent] = useState(0);

  const rotate = position.x.interpolate({
    inputRange: [-SCREEN_WEIGHT / 2, 0, SCREEN_WEIGHT / 2],
    outputRange: ['-10deg', '0deg', '10deg'],
    extrapolate: 'clamp'
  })
 
  const rotateAndTranslate = {
    transform: [{
      rotate: rotate,
    }, ...position.getTranslateTransform()]
  }

  const likeOpacity = position.x.interpolate({
    inputRange: [-SCREEN_WEIGHT / 2, 0, SCREEN_WEIGHT / 2],
    outputRange: [0, 0, 1],
    extrapolate: 'clamp'
  })

  const dislikeOpacity = position.x.interpolate({
    inputRange: [-SCREEN_WEIGHT / 2, 0, SCREEN_WEIGHT / 2],
    outputRange: [1,0,0],
    extrapolate: 'clamp'
  })

  const nextCardOpacity = position.x.interpolate({
    inputRange: [-SCREEN_WEIGHT / 2, 0, SCREEN_WEIGHT / 2],
    outputRange: [1,0, 1],
    extrapolate: 'clamp'
  })

  const nextCardScale = position.x.interpolate({
    inputRange: [-SCREEN_WEIGHT/2, 0, SCREEN_WEIGHT / 2],
    outputRange: [1,0.75,1],
    extrapolate: 'clamp'
   })

  const renderColors = () => {
    return colors.map((item, i) => {

      const panres = PanResponder.create({
        onStartShouldSetPanResponder: (evt, gestureState) => true,
        onPanResponderMove: (evt, gestureState) => {
          position.setValue({ x: gestureState.dx, y: gestureState.dy })
        },
        onPanResponderRelease: (evt, gestureState) => {
          if (gestureState.dx > 120) {
            Animated.spring(position, {
              useNativeDriver: true,
              toValue: { x: SCREEN_HEIGHT + 120, y: gestureState.dy }
            }).start(() => {
              setCurrent(currentIndex + 1), () => position.setValue({ x: 0, y: 0 })
            })
          }
          else if (gestureState.dx < -120) {
            Animated.spring(position, {
              useNativeDriver: true,
              toValue: { x: -SCREEN_HEIGHT - 120, y: gestureState.dy }
            }).start(() => {
              setCurrent(currentIndex + 1), () => position.setValue({ x: 0, y: 0 })
            })
          }
          else{
            Animated.spring(position,{
              toValue:{x:0,y:0},
              friction: 4,
              useNativeDriver: true
            }).start()
          }
        }
      })  

      if (i < currentIndex) {
        return null
      }
      else if (i==currentIndex) {
        return (
          <Animated.View
            {...panres.panHandlers}
            key={item.id} style={[rotateAndTranslate, { padding:40, position: 'absolute',
           height: SCREEN_HEIGHT - 120, width: SCREEN_WEIGHT
          }]}
            >
            <Animated.View style={[{opacity: likeOpacity,left:40},styles.button]}>
              <Ionicons name="checkmark-circle" size={100} color="green" />
            </Animated.View>
            <Animated.View style={[{opacity: dislikeOpacity,right:40},styles.button]}>
              <Entypo name="circle-with-cross" size={100} color="red" />
            </Animated.View>
            <View style={[styles.card,{backgroundColor:item.color}]} />
          </Animated.View>
        )
      }
      else{
        return (
          <Animated.View
            key={item.id} style={[rotateAndTranslate, {opacity:nextCardOpacity,alignSelf:'center', padding:40, position: 'absolute', 
            top:i-currentIndex<3?10*(i-currentIndex):10,height: SCREEN_HEIGHT - 120, width: SCREEN_WEIGHT-(3*i),
            transform:[{scale:nextCardScale}]}]}
            >
            <View style={[styles.card,{backgroundColor:item.color}]} />
          </Animated.View>  
        )
      }

    }).reverse()
  }

  return (
    <View style={{ flex: 1 }}>
      <View style={{ height: 60 }}>
      </View>
      <View style={{ flex: 1 }}>
        {renderColors()}
      </View>
      <View style={{ height: 60 }}>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { flex: 1, 
     width: null,
     resizeMode: 'cover', 
     borderRadius: 10, 
     },
     button:{
      position: 'absolute',
      top: 50,
      zIndex: 1000 
     }
});
