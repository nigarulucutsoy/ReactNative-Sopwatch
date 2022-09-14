import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import moment from 'moment';

const screen = Dimensions.get("window");0


function Timer ({interval, style}){
  const pad = (n)=> n < 10 ? '0' + n : n
  const duration =moment.duration(interval)
  const centiseconds =Math.floor(duration.milliseconds()/10)
  return(
    <View>
      <Text style={styles.timerContainer}>
       <Text style={style}>{pad (duration.minutes())}:</Text> 
       <Text style={style}>{pad(duration.seconds())}.</Text> 
       <Text style={style}>{pad(centiseconds)}</Text> 
      </Text>
    </View>
  )
}

function Button({title,color, backgroundcolor, onPress, disabled}){
  return(
    <TouchableOpacity
    onPress={()=> !disabled && onPress()}
    style={[styles.roundbutton, {backgroundColor:backgroundcolor}]}
    activeOpacity={disabled ? 1.0 : 0.7}
    >
    <Text style={[styles.roundtitle,{color}]}>{title}</Text>
    </TouchableOpacity >
  )
}   

function Lap({number, interval}){
  return(
    <View style={styles.tour}>
      <Text style={styles.tourText}> Tour {number}</Text>
      <Timer style={styles.tourText} interval={interval}/>
    </View>
  )
}

function LapsTable({laps, timer}){
  const finishedLaps = laps.slice(1)
  return(
    <ScrollView style={styles.scrollView}>
      {laps.map((lap,index)=> (
        <Lap 
        number={laps.length - index} 
        key={laps.length - index } 
        interval={index == 0 ? timer + lap: lap}/> ))}
    </ScrollView>
  )
}
function ButtonsRow({children}){
return(
  <View style={styles.buttonsRow}>{children}</View>
)
}
export default class App extends Component{
  constructor(props){
    super(props)
    this.state ={
      start: 0,
      now:0,
      laps: [ ],
    }
  }

  componentWillUnmount(){
    clearInterval(this.timer)
  }
  start = () =>{
    const now = new Date().getTime()
    this.setState(
     { start : now,
      now,
      laps: [0],}
    )
    this.timer = setInterval(()=>{
      this.setState({
        now: new Date().getTime()})
    }, 100)
  }

  lap = ()=> {
    const timestamp = new Date().getTime()
    const {laps, now, start} = this.state
    const [firstLap, ...other]= laps
    this.setState ({
      laps: [0, firstLap+ now-start, ...other],
      start:timestamp,
      now:timestamp,

    })
  }

  stop= () => {
    clearInterval(this.timer)
    const {laps, now, start} = this.state
    const [firstLap, ...other]= laps
    this.setState ({
      laps: [firstLap+ now-start, ...other],
      start:0,
      now:0,

    })
  }

  reset= () =>{
    this.setState({
      laps: [],
      start:0,
      now:0,

    })
  }
  resume =()=>{
    const now = new Date().getTime()
    this.setState({
      start: now,
      now,
    })
    this.timer = setInterval(()=>{
      this.setState({
        now: new Date().getTime()})
    }, 100)

  }
  
  render() {
    const {start, now, laps} = this.state
    const timer= now-start
    return(
        <View style={styles.container}>
          <Timer interval={laps.reduce((total, curr)=>total+curr, 0 )+ timer} 
          style={styles.timer}/>
          <LapsTable laps={laps} timer={timer}/>
          {laps.length == 0 && (
            <ButtonsRow>
            <Button 
            title='Tour' 
            color='#07121B' 
            backgroundcolor="grey"
            disabled
            
            />
            <Button 
            title='Start' 
            color="#07121B" 
            backgroundcolor="#89AAFF"
            onPress={this.start}
            />
          </ButtonsRow> 
          )}
          {start > 0 && 
          <ButtonsRow>
            <Button 
            title='Tour' 
            color='#07121B' 
            backgroundcolor="grey"
            onPress={this.lap}
            />
            <Button 
            title='Stop' 
            color="#07121B" 
            backgroundcolor="#FF851B"
            onPress={this.stop}
            />
          </ButtonsRow>  }
          {laps.length>0 && start == 0 &&( 
          <ButtonsRow>
            <Button 
            title='Reset' 
            color='#07121B' 
            backgroundcolor="grey"
            onPress={this.reset}
            />
            <Button 
            title='Resume' 
            color="#07121B" 
            backgroundcolor="#89AAFF"
            onPress={this.resume}
            />
          </ButtonsRow>  )}
           
        </View>
    )
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,

    backgroundColor: '#07121B',
    alignItems: 'center',
    paddingTop:130,
    paddingHorizontal:20,
  },
  timer: {
    color:'#fff',
    fontSize:70,
    fontWeight:'300',
    marginBottom:40,
  },
  roundbutton: {
    backgroundColor:"#89AAFF",
    width: screen.width / 3,
    height: screen.height / 15,
    borderRadius: screen.width / 3,
    alignItems: "center",
    justifyContent: "center",
    marginBottom:45,
  },
  roundtitle: {
    fontSize: 20,
    color: "#07121B",
    fontWeight:"480"
  },
  buttonsRow:{
    flexDirection:'row',
    alignSelf:'stretch',
    justifyContent:'space-between',
    
  },
  tourText: {
    color:'#FFFFFF',
    fontSize:18,

  },
  tour:{
    flexDirection:'row',
    justifyContent:'space-between',
    borderColor:'#151515',
    borderTopWidth:1,
    paddingVertical:10, 
  }, 
  scrollView: {
    alignSelf:'stretch',
  },
  timerContainer:{
    flexDirection:'row'
  }
  
}) 