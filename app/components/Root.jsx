import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { ActionCreators } from 'redux-undo';
import { loadGraph, showGraph, 
         zoomIn, zoomOut, resetZoom, 
         moveNode, moveEdge, moveCaption,
         swapNodeHighlight, swapEdgeHighlight, swapCaptionHighlight,
         swapNodeSelection, swapEdgeSelection, swapCaptionSelection,
         deleteSelection, deselectAll,
         pruneGraph, layoutCircle, 
         addNode, addEdge, addCaption,
         updateNode, updateEdge, updateCaption,
         deleteAll, addSurroundingNodes,
         toggleEditTools, toggleAddForm,
         setNodeResults, setTitle,
         loadAnnotations, showAnnotation, createAnnotation,
         toggleAnnotations, updateAnnotation,
         deleteAnnotation, moveAnnotation,
         toggleHelpScreen, setSettings, toggleSettings } from '../actions';
import Graph from './Graph';
import GraphModel from '../models/Graph';
import { HotKeys } from 'react-hotkeys';
import ReactDOM from 'react-dom';
import pick from 'lodash/object/pick';
import merge from 'lodash/object/merge';
import cloneDeep from 'lodash/lang/cloneDeep';
import isNumber from 'lodash/lang/isNumber';
import keys from 'lodash/object/keys';
import Editor from './Editor';
import GraphHeader from './GraphHeader';
import GraphAnnotations from './GraphAnnotations';
import EditButton from './EditButton';
import HelpButton from './HelpButton';
import HelpScreen from './HelpScreen';
import SettingsButton from './SettingsButton';
import GraphSettingsForm from './GraphSettingsForm';
import SaveButton from './SaveButton';

class Root extends Component {
  constructor(props) {
    super(props);
    this.state = { shiftKey: false };
  }

  render() {
    const keyMap = { 
      'undo': 'ctrl+,',
      'redo': 'ctrl+.',
      'zoomIn': 'ctrl+=',
      'zoomOut': 'ctrl+-',
      'resetZoom': 'ctrl+0',
      'shiftDown': { sequence: 'shift', action: 'keydown' },
      'shiftUp': { sequence: 'shift', action: 'keyup' },
      'altDown': [
        { sequence: 'alt', action: 'keydown' }, 
        { sequence: 'ctrl', action: 'keydown' },
        { sequence: 'command', action: 'keydown' }
      ],
      'altUp': [
        { sequence: 'alt', action: 'keyup' },
        { sequence: 'ctrl', action: 'keyup' },
        { sequence: 'command', action: 'keyup' }
      ],
      'delSelected': ['alt+d', 'ctrl+d', 'command+d']
    };

    const keyHandlers = {
      'undo': () => { dispatch(ActionCreators.undo()) },
      'redo': () => { dispatch(ActionCreators.redo()) },
      'zoomIn': () => dispatch(zoomIn()),
      'zoomOut': () => dispatch(zoomOut()),
      'resetZoom': () => dispatch(resetZoom()),
      'shiftDown': () => this.setState({ shiftKey: true }),
      'shiftUp': () => this.setState({ shiftKey: false }),
      'altDown': () => this.setState({ altKey: true }),
      'altUp': () => this.setState({ altKey: false }),
      'delSelected': () => dispatch(deleteSelection(this.props.graph.id, this.props.selection))
    };

    let { dispatch, graph, isEditor, isLocked, graphTitle,
          showEditTools, showSaveButton, showHelpScreen, 
          hasSettings, graphSettings, showSettings, onSave,
          currentIndex, annotation, annotations, showAnnotations } = this.props;
    let that = this;

    let graphApi = {
      getGraph: () => this.props.graph,
      zoomIn: () => dispatch(zoomIn()),
      zoomOut: () => dispatch(zoomOut()),
      resetZoom: () => dispatch(resetZoom()),
      prune: () => dispatch(pruneGraph(graph.id)),
      circleLayout: () => dispatch(layoutCircle(graph.id)),
      addNode: (node) => dispatch(addNode(graph.id, node)),
      addEdge: (edge) => dispatch(addEdge(graph.id, edge)),
      addCaption: (caption) => dispatch(addCaption(graph.id, caption)),
      updateNode: (nodeId, data) => dispatch(updateNode(graph.id, nodeId, data)),
      updateEdge: (edgeId, data) => dispatch(updateEdge(graph.id, edgeId, data)),
      updateCaption: (captionId, data) => dispatch(updateCaption(graph.id, captionId, data)),
      deselectAll: () => dispatch(deselectAll(graph.id)),
      deleteAll: () => dispatch(deleteAll(graph.id)),
      addSurroundingNodes: (centerId, nodes) => dispatch(addSurroundingNodes(graph.id, centerId, nodes))
    };

    let _toggleEditTools = (value) => { dispatch(toggleEditTools(value)) };


    // annotations stuff

    let prevIndex = this.prevIndex();
    let nextIndex = this.nextIndex();

    let prevClick = () => dispatch(showAnnotation(prevIndex));
    let nextClick = () => dispatch(showAnnotation(nextIndex));
    let update = (index, data) => dispatch(updateAnnotation(index, data));
    let remove = (index) => dispatch(deleteAnnotation(index));
    let show = (index) => dispatch(showAnnotation(index));
    let create = () => { 
      dispatch(createAnnotation(this.props.annotations.length)); 
    };
    let move = (from, to) => dispatch(moveAnnotation(from, to));
    let swapAnnotations = (value) => dispatch(toggleAnnotations(value));
    let updateTitle = (title) => dispatch(setTitle(title));
    let updateSettings = (settings) => dispatch(setSettings(settings));

    let hasAnnotations = this.props.numAnnotations > 0;

    return (
      <div id="oligrapherContainer" style={{ height: '100%' }}>
        <HotKeys focused={true} attach={window} keyMap={keyMap} handlers={keyHandlers}>
          <div className="row">
            <div className={showAnnotations && hasAnnotations ? "col-md-8" : "col-md-12"}>
              { isEditor || graphTitle ? 
                <GraphHeader
                  graph={this.props.graph}
                  title={this.props.graphTitle}
                  url={this.props.url}
                  updateTitle={updateTitle}
                  user={this.props.user}
                  date={this.props.date}
                  links={this.props.links}
                  isEditor={isEditor} /> : null }

              <div id="oligrapherGraphContainer">
                { this.props.graph ? <Graph 
                  ref={(c) => { this.graph = c; if (c) { c.root = this; } }}
                  graph={this.props.graph}
                  zoom={this.props.zoom} 
                  height={this.props.height}
                  isEditor={isEditor}
                  isLocked={isLocked}
                  viewOnlyHighlighted={this.props.viewOnlyHighlighted}
                  selection={this.props.selection}
                  resetZoom={() => dispatch(resetZoom())} 
                  moveNode={(graphId, nodeId, x, y) => dispatch(moveNode(graphId, nodeId, x, y))} 
                  moveEdge={(graphId, edgeId, cx, cy) => dispatch(moveEdge(graphId, edgeId, cx, cy))} 
                  moveCaption={(graphId, captionId, x, y) => dispatch(moveCaption(graphId, captionId, x, y))} 
                  clickNode={(graphId, nodeId) => { 
                    isEditor && showEditTools ? 
                    dispatch(swapNodeSelection(nodeId, !that.state.shiftKey)) : 
                    (isLocked ? null : dispatch(swapNodeHighlight(graphId, nodeId))) 
                  }}
                  clickEdge={(graphId, edgeId) => { 
                    isEditor && showEditTools ? 
                    dispatch(swapEdgeSelection(edgeId, !that.state.shiftKey)) : 
                    (isLocked ? null : dispatch(swapEdgeHighlight(graphId, edgeId)))
                  }}
                  clickCaption={(graphId, captionId) => { 
                    isEditor && showEditTools ? 
                    dispatch(swapCaptionSelection(captionId, !that.state.shiftKey)) : 
                    (isLocked ? null : dispatch(swapCaptionHighlight(graphId, captionId)))
                  }} /> : null }

                { this.props.graph ? <Editor 
                  graph={this.props.graph}
                  graphApi={graphApi}
                  isEditor={isEditor} 
                  showEditTools={this.props.showEditTools} 
                  showEditButton={false} 
                  hideHelp={true} 
                  dataSource={this.props.dataSource} 
                  selection={this.props.selection} 
                  nodeResults={this.props.nodeResults}
                  setNodeResults={(nodes) => dispatch(setNodeResults(nodes))}
                  addForm={this.props.addForm}
                  toggleEditTools={_toggleEditTools}
                  toggleAddForm={(form) => dispatch(toggleAddForm(form))}
                  undo={() => dispatch(ActionCreators.undo())}
                  redo={() => dispatch(ActionCreators.redo())} 
                  canUndo={(this.props.canUndo)}
                  canRedo={this.props.canRedo} /> : null }

                <div id="oligrapherMetaButtons">
                  { isEditor ? 
                    <EditButton toggle={() => dispatch(toggleEditTools())} showEditTools={showEditTools} /> : null }
                  { isEditor && hasSettings ? 
                    <SettingsButton toggleSettings={(value) => dispatch(toggleSettings(value))} /> : null }
                  { isEditor ? 
                    <HelpButton toggleHelpScreen={() => dispatch(toggleHelpScreen())} /> : null }
                </div>

                { showSettings && hasSettings ? <GraphSettingsForm settings={graphSettings} updateSettings={updateSettings} /> : null }
              </div>
            </div>
            { showAnnotations && hasAnnotations ?
              <GraphAnnotations 
                isEditor={isEditor}
                navList={this.props.isEditor}
                prevClick={prevClick}
                nextClick={nextClick}
                swapAnnotations={swapAnnotations}
                annotation={annotation}
                annotations={annotations}
                currentIndex={currentIndex}
                show={show}
                create={create}
                update={update}
                move={move}
                remove={remove}
                editForm={true}
                hideEditTools={() => dispatch(toggleEditTools(false))} /> : null }
          </div>
          { !showAnnotations && hasAnnotations ? 
            <div id="oligrapherShowAnnotations">
              <button onClick={() => swapAnnotations()} className="btn btn-lg btn-default">
                <span className="glyphicon glyphicon-font"></span>
              </button>
            </div> : null }          
          { showSaveButton && isEditor && onSave ? <SaveButton save={() => this.handleSave()} /> : null }
          { showHelpScreen ? <HelpScreen source={this.props.dataSource} close={() => dispatch(toggleHelpScreen(false))} /> : null }
        </HotKeys>
      </div>
    );
  }

  componentDidMount() {
    let { dispatch, title, graph, graphData, annotationsData, startIndex, settings, onSave } = this.props;

    if (graphData) {
      // data provided from outside
      this.loadData(graphData);
    } else if (!graph) {
      // load empty graph
      this.loadData(GraphModel.defaults());
    }

    if (title) {
      dispatch(setTitle(title));
    }

    if (annotationsData) {
      dispatch(loadAnnotations(annotationsData));
    }

    startIndex = (annotationsData[startIndex] ? startIndex : 0);

    if (startIndex) {
      dispatch(showAnnotation(startIndex));
    }

    if (settings) {
      dispatch(setSettings(settings));
    }
  }

  componentDidUpdate(prevProps) {
    // fire selection callback with glorified selection state if selection changed
    if (this.props.onSelection) {
      let { selection, graph } = this.props;

      if (JSON.stringify(prevProps.selection) !== JSON.stringify(selection)) {
        this.props.onSelection(selection);
      }
    }

    // fire update callback if graph changed
    if (this.props.onUpdate) {
      if (JSON.stringify(prevProps.graph) !== JSON.stringify(this.props.graph)) {
        this.props.onUpdate(this.props.graph);
      }
    }
  }

  loadData(data) {
    // showGraph needs a graph id so it's set here
    let graph = GraphModel.setDefaults(data);
    this.props.dispatch(loadGraph(graph));
    this.props.dispatch(showGraph(graph.id));
  }

  toggleEditor(value) {
    this.setState({ isEditor: value });
    this.props.dispatch(deselectAll(this.props.graph.id));
  }

  toggleLocked(value) {
    this.setState({ isLocked: value });
  }

  prevIndex() {
    let { currentIndex, numAnnotations } = this.props;
    return currentIndex - 1 < 0 ? null : currentIndex - 1;
  }

  nextIndex() {
    let { currentIndex, numAnnotations } = this.props;
    return currentIndex + 1 > numAnnotations - 1 ? null : currentIndex + 1;
  }

  visibleAnnotations() {
    return this.props.showAnnotations && this.props.numAnnotations > 0;
  }

  graphWithoutHighlights() {
    return pick(
      GraphModel.clearHighlights(this.props.graph),
      ['nodes', 'edges', 'captions']
    );
  }

  handleSave() {
    if (this.props.onSave) {
      this.props.onSave({
        title: this.props.graphTitle,
        graph: this.graphWithoutHighlights(),
        annotations: this.props.annotations,
        settings: this.props.graphSettings
      });
    }
  }
}

function select(state) {
  return {
    graph: state.graphs.present[state.position.currentId],
    canUndo: state.graphs.past.length > 0,
    canRedo: state.graphs.future.length > 0,
    loadedId: state.position.loadedId,
    selection: state.selection,
    zoom: state.zoom,
    showEditTools: state.editTools.visible,
    addForm: state.editTools.addForm,
    nodeResults: state.editTools.nodeResults,
    graphTitle: state.title,
    currentIndex: state.position.currentIndex,
    numAnnotations: state.annotations.list.length,
    annotation: state.annotations.list[state.position.currentIndex],
    annotations: state.annotations.list,
    showAnnotations: state.annotations.visible,
    graphSettings: state.settings,
    hasSettings: Object.keys(state.settings).length > 0,
    showHelpScreen: state.showHelpScreen,
    showSettings: state.showSettings
  };
}

export default connect(select, null, null, { withRef: true })(Root);