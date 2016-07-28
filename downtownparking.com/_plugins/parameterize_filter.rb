module Jekyll
  module ParameterizeFilter
    def parameterize(input, sep = '-')
      parameterized_string = input.to_s.dup
      parameterized_string.downcase!
      parameterized_string.gsub!(/[^a-z0-9\-_]+/, sep)
      unless sep.nil? || sep.empty?
        re_sep = Regexp.escape(sep)
        # No more than one separator in a row
        parameterized_string.gsub!(/#{re_sep}{2,}/, sep)
        # Remove leading/trailing separator
        parameterized_string.gsub!(/^#{re_sep}|#{re_sep}$/, '')
      end
      parameterized_string
    end
  end
end

Liquid::Template.register_filter(Jekyll::ParameterizeFilter)
