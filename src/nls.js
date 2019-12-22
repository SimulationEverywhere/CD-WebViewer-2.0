'use strict';

var nls = {
	"Main_DashBoard_Save" : {
		"en" : "Save dashboard"
	},
	"Header_Lab" : {
		"en" : "<a href='http://vs3.sce.carleton.ca/wordpress/' target='_blank'>ARSLab</a>"
	},
	"Header_App" : {
		"en" : "<a href='http://cell-devs.sce.carleton.ca/intranet/webviewer/' target='_blank'>Simulation Viewer</a>"
	},
	"Header_Tutorial" : {
		"en" : "&#128304; tutorials"
	},
	"Header_Sample" : {
		"en" : "&#9733; samples"
	},
	"Header_Problem" : {
		"en" : "&#9749; report a problem"
	},
	"Dropzone_Instructions" : {
		"en":"Drag and drop<br>or<br>Click to browse"
	},
	"Dropzone_Title" : {
		"en":"Simulation files"
	},
	"Main_Load" : {
		"en" : "Load Simulation"
	},

	"Info_Title" : {
		"en" : "Information"
	},
	"Info_NoFiles" : {
		"en" : "No files loaded."
	},
	"Info_Label_Name" : {
		"en" : "Model name:"
	},
	"Info_Label_Files" : {
		"en" : "Files:"
	},
	"Info_Label_Simulator" : {
		"en" : "Simulator:"
	},
	"Info_Label_NumberFrames" : {
		"en" : "Number of frames:"
	},
	"Widget_AutoDevsDiagram" : {
		"en" : "DEVS Diagram"		
	},
	"DevsDiagram_Title" : {
		"en" : "DEVS Diagram"
	},
	"Widget_DEVS_Tooltip_Title" : {
		"en" : "Model Id : {0} <br>Last output : {1}"		
	},
	"Widget_DevsDiagram" : {
		"en" : "Select a SVG File: "		
	},
	"SVG_Instructions" : {
		"en":"Click to browse"
	},
	"Info_Label_NumberTransitions" : {
		"en" : "Number of transitions:"
	},
	"Info_Label_LastFrame" : {
		"en" : "Last frame:"
	},
	"Playback_FastBackward" : {
		"en" : "Go to first frame"
	},
	"Playback_StepBack" : {
		"en" : "Step back"
	},
	"Playback_Backwards" : {
		"en" : "Play backwards"
	},
	"Playback_Play" : {
		"en" : "Play forward"
	},
	"Playback_StepForward" : {
		"en" : "Step forward"
	},
	"Playback_FastForward" : {
		"en" : "Go to last frame"
	},
	"Playback_Seek" : {
		"en" : "Slide to seek frame"
	},
	"Playback_Record" : {
		"en" : "Record simulation to .webm"
	},
	"Settings_Title" : {
		"en" : "Settings"
	},
	"Settings_FPS" : {
		"en" : "Frames per second:"
	},
	"Settings_Loop" : {
		"en" : "Loop:"
	},
	"Settings_ShowGrid" : {
		"en" : "Show grid:"
	},
	"Settings_Size" : {
		"en" : "Row Height:"
	},
	"Control_PaletteEditor" : {
		"en" : "Palette editor"
	},	
	"Control_RiseList" : {
		"en":"Load model from RISE"
	},
	"Palette_Title" : {
		"en" : "Palette editor:"
	},
	"Palette_Start" : {
		"en" : "From"
	},
	"Palette_End" : {
		"en" : "To"
	},
	"Palette_Save" : {
		"en" : "Save"
	},
	"Palette_Add" : {
		"en" : "Add new class"
	},
	"Selector_Title" : {
		"en" : "Select a widget"
	},
	"Selector_Load" : {
		"en" : "Load Widget"
	},
	"Widget_ConfigGrid" : {
		"en" : "Select a layer: "		
	},
	"Widget_AutoGrid" : {
		"en" : "Simulation Layer"		
	},
	"Grid_Title" : {
		"en" : "Simulation Layer"		
	},
	"Widget_AutoTransitionMap" : {
		"en" : "Transition Heatmap"		
	},
	"Widget_AutoGrid_Tooltip_Title" : {
		"en" : "The state of model ({0}, {1}, {2}) is {3}."		
	},
	"Widget_AutoStateChart" : {
		"en" : "State Frequency Chart"		
	},
	"Widget_AutoTransitionChart" : {
		"en" : "Transition Chart (Not implemented)"		
	},
	"Widget_AutoTransitionMap_Tooltip_Title" : {
		"en" : "The number of transitions for model ({0}, {1}, {2}) is {3}."		
	},
	"Widget_AutoCellTrackChart" : {
		"en" : "Model Track Chart"		
	},
	"StateChart_Title" : {
		"en" : "State Frequency Chart"		
	},
	"StateChart_YAxis" : {
		"en" : "Frequency"		
	},
	"StateChart_XAxis" : {
		"en" : "State"		
	},
	"StateChart_Tooltip_Title" : {
		"en" : "At frame {0} there are {1} models with state {2}."		
	},
	"CellTrackChart_Title" : {
		"en" : "Model Track Chart"		
	},
	"CellStateChart_YAxis" : {
		"en" : "State"		
	},
	"CellStateChart_XAxis" : {
		"en" : "Frame"		
	},
	"CellStateChart_Layer" : {
		"en" : "Select a layer: "		
	},
	"CellTrackConfig_Tracked" : {
		"en" : "Select tracked states: "		
	},
	"CellTrackChart_Tooltip_Title" : {
		"en" : "At frame {0} the state of model:"		
	},
	"CellTrackChart_Tooltip_Line" : {
		"en" : "({0}) is {1}"		
	}, 
	"CellTrackConfig_Type" : {
		"en" : "Model states are continuous or discrete? "
	},
	"CellTrackConfig_Type_Discrete" : {
		"en" : "Continuous"
	},
	"CellTrackConfig_Type_Continuous" : {
		"en" : "Discrete"
	},
	"CellTrackConfig_Selected" : {
		"en" : "Selected models (temporary): "
	},
	"TransitionMapConfig_Z" : {
		"en" : "Selected Layer: "
	},
	"TransitionMapConfig_ColorRange" : {
		"en" : "Color range"
	},
	"TransitionMapConfig_ColorMin" : {
		"en" : "Minimum: "
	},
	"TransitionMapConfig_ColorMax" : {
		"en" : "Maximum: "
	},
	"TransitionMapConfig_N" : {
		"en" : "Number of color classes: "
	},
	"TransitionMap_Title" : {
		"en" : "Transition Map for Layer {0}"
	},
	"Configurator_Continue" : {
		"en" : "Continue..."
	},
	"Configurator_Title" : {
		"en" : "{0} Configuration"
	},
	"Main_Unsupported_Browser" : {
		"en" : "This application is for the Chrome browser. It requires many features that are not supported by other browsers."
	},
	"Tooltip_control" : {
		"en" : "Drop your files in the Drop-Zone, you can either drag and drop files or Click to browse. "
			+	"To Load Cell DEVS Simulation- you need to drop .log file and a .ma files."
			+  "To Load DEVS simulation- Drop .log , .ma and .svg files ."
			+  "You can see the information about the files you just uploaded in the Information Tab."
			+  "Configure the visualization through Settings. You can change colors of visualization from the color Pallete on the right side."
			+  "Load the simulation by clicking on Load Simulation  Button. "
			+	"You can animate the visualization by the PlayBack Widget. Play, Pause, Skip to the frame you want to visualize."
			+  "Record the Video of simulation by clicking the record button."
	},
	"Addiction Model" : {
	"en" : "A Cell-DEVS  model to simulate the criminal activities in the area and the hard drug (for example, cocaine and heroin) consumption based on the fact that the addiction to the criminal activities leads to increased criminal activities in an area."	
	},
	"CO2 Model" : {
	"en" : "This is the desciption of Cell-DEVS CO2-model"	
	},
	"Fire Model" : {
	"en" : "The simulation allows to foresee the propagation and intensity of the fire in a forest."	
	},
	"Fire And Rain Model" : {
	"en" : "A Cell-DEVS  model to simulate a rainstorm  in a burning forest. It moves to SE, extinguishing the fire on burning cells."	
	},
	"Life Model" : {
	"en" : "A Cell-DEVS model to simulate the life game with Conway rules."	
	},
	"Logistic Urban Growth Model" : {
	"en" : "A Cell-DEVS  model to study Urban growth with increasing population, since population moves into the cell where geology suitability is fine and expands with time, almost the majority of land will be turned into urban with the population increase."	
	},
	"Swarm Model" : {
	"en" : "A Cell-DEVS  model to detect pattern in Swarm genration and to show pattern swarm undergo their life."	
	},
	"Tumor Model" : {
	"en" : "A Cell-DEVS  model to simulate the tumor growth, and expanded those models to include the response of the immune system."	
	},
	"UAV Model" : {
	"en" : "A Cell-DEVS  model to simulate the Unmanned Aerial Vehicles (UAV) target search task, specifically the concept of using target location probability gradient fields to the UAV target search task, specifically the concept of using target location probability gradient fields."	
	},
	"Worm Model" : {
	"en" : "A Cell-DEVS  model to simulate a typical process of spread of worm, in a LAN(Local Area Network)."	
	}
}

export default nls;