module Jekyll
  module HtmlFilter
    def html(input)
      output = input.dup
      output.gsub!(/&(?!amp;)/, '&amp;')
      output.gsub!(/'/, '&rsquo;')
      output
    end
  end
end

Liquid::Template.register_filter(Jekyll::HtmlFilter)
