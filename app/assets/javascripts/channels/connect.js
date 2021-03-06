connect = () => {
  App.moves = App.cable.subscriptions.create('MovesChannel', {  
    received: (data) => {
      $('#move-input').val('');
      if (data.text) this.textResponse(data.text); 
      if (data.update) {
	this.renderGrid(data.grid_state);
	this.selectedProgram(
	  data.grid_state.programs[data.grid_state.selected_program] 
	);
	this.currentMode(data.grid_state)
      }
      return
    }
  });
}

textResponse = (text) => {
  $('#moves').prepend("<p>" + text + "</p>");
}

currentMode = (grid_state) => {
  $('#selected-mode').html(
    `
      <p>${grid_state.mode}</p>
    `
  )
}

selectedProgram = (program) => {
  $('#selected-program').html(
    `
      <p>Name: ${program.name}</p>
      <p>Max Size: ${program.max_size}</p>
      <p>Max Move: ${program.max_move}</p>
      <p>Moves Left: ${program.cur_move}</p>
      <p>Attack Range: ${program.range}</p>
    `
  )
}
	
renderGrid = (grid_state) => {
  let newGrid = ""
  gs = grid_state
  let types = grid_state.tile_types
  let programs = grid_state.programs
  let sprogram = grid_state.selected_program
  grid_state.reference_map.forEach( (row) => {
    row.forEach( (ref) => {
      newGrid +=
      `
        <div style="background: rgba(${backgroundColor(ref, types, programs, sprogram)})" class="tile">
          <div style="border: 4px solid rgba(${highlightColor(ref, types)})" class="decoration">
            ${letterLabel(ref, types, programs)}
          </div>
        </div>
      `
    });
  });
  $("#game-grid").css("grid-template-areas","'" + "a ".repeat(grid_state.reference_map[0].length) + "'")
  $("#game-grid").html(newGrid);
}

backgroundColor = (ref, types, programs, sprogram) => {
  let color = [255,255,255];
  let opacity = 0.3;
  if (types[ref].type == "program") {
    color = programs[types[ref].owner].color
    if (sprogram == types[ref].owner)
      opacity = 1.0;
    else
      opacity = 0.7;
  }
  return `${color[0]}, ${color[1]}, ${color[2]}, ${opacity}` 
}

highlightColor = (ref, types) => {
  let color = [220,48,48];
  let opacity = 0.0;
  let highlight = types[ref].highlight
  if (highlight) {
    if (highlight == "selected"){
      color = [255,64,64]
      opacity = 1
    }
    else
      opacity = 0.5
  }
  return `${color[0]}, ${color[1]}, ${color[2]}, ${opacity}` 
}

letterLabel = (ref, types, programs) => {
  if (types[ref].head) {
    if (types[ref].type == "program"){
      return (programs[types[ref].owner].name[0])
    } else {
      return ("")
    }
  } else {
    return ("")
  }
}
