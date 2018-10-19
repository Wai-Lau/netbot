class Grid
  class Program
    attr_accessor :name
    attr_accessor :color
    attr_accessor :max_size
    attr_accessor :sector_list
    attr_accessor :max_move
    attr_accessor :cur_move

    def cur_size
      if @sector_list.nil?
        return 0
      else
        return @sector_list.length
      end
    end

    def initialize(name_symbol=nil)
      return if name_symbol.nil?
      if PROGRAM_LIST[name_symbol]
        program_data = PROGRAM_LIST[name_symbol]
        @name = if program_data[:name]
                  program_data[:name]
                else
                  name_symbol.to_s.capitalize
                end
        @color = program_data[:color]
        @max_size = program_data[:max_size]
        @max_move = program_data[:max_move]
        @cur_move = program_data[:max_move]
      end
    end

    def move(move, tiles=nil)
      if %w(h j k l).include? move
        raise ArgumentError, "No tiles for move command." unless tiles
        move_program(move, tiles)
      end
    end

    private
    
    def move_program(move, tiles)
      dest = destination(move)
      if not collision? dest, tiles
        #old_sectors = @sector_list
        @cur_move -= 1
        @sector_list.unshift(dest)
        if cur_size > @max_size
          @sector_list.pop
        end
        #redundant but this is better
        #Grid::StateUpdater.update(tiles, self, old_sectors)
      end
    end

    def destination(move)
      row, col = @sector_list.first
      begin
        case move
        when "h"
          [row, col-1]
        when "j"
          [row+1, col]
        when "k"
          [row-1, col]
        when "l"
          [row, col+1]
        end
      end
    end

    def collision?(destination, tiles)
      row, col = destination
      begin
        !tiles[row][col].space?
      rescue IndexError
        true
      end
    end

    PROGRAM_LIST = {
      hack: {
        name: "Hack 1.0",
        color: "Cyan",
        max_size: 4,
        max_move: 2
      },

      slingshot: {
        color: "Teal",
        max_size: 3,
        max_move: 2
      }
    }
  end
end

