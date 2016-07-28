module Jekyll
  module DecimalFilter
    def before_decimal(input)
      input.split('.')[0]
    end

    def after_decimal(input)
      input.split('.')[1]
    end

    def char_align(input, char = '.', divider = nil)
      output = ""
      if input =~ Regexp.new(Regexp.escape(char))
        output << %Q{<td class="char-align">}
        items = input.split(divider)
        items_formatted = items.map do |item|
          integer, decimal = item.split(char)
          %Q{<span class="left">#{integer}</span><span class="right">#{char.gsub(' ', '&nbsp;')}#{decimal}</span>}
        end
        output << items_formatted.join('<br style="clear: both;">')
        output << "</td>"
      else
        output << %Q{<td>#{input}</td>}
      end
      output
    end

    def to_fixed(input, places_input = '0')
      places = places_input.to_i
      output = input.to_f.round(places).to_s
      if output == '0.0'
        output = '0.1'
      end
      output
    end
  end
end

Liquid::Template.register_filter(Jekyll::DecimalFilter)
