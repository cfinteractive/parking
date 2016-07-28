module Jekyll
  class DecimalTableTag < Liquid::Tag
    def initialize(tag_name, text, tokens)
      super
      @text = text
    end

    def render(context)
      if @text =~ /\./
        integer, decimal = @text.split('.')
        %Q{<td class="before-decimal">#{integer}</td><td>.#{decimal}</td>}
      else
        %Q{<td colspan="2">#{@text}</td>}
      end
    end
  end
end

Liquid::Template.register_tag('decimal_table', Jekyll::DecimalTableTag)
