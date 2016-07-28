require 'pp'
module Jekyll
  class Page
    def inspect
      "#Jekyll:Page @name=#{self.name.inspect}"
    end
  end

  module DebugFilter
    def debug(obj, stdout=false)
      puts obj.pretty_inspect if stdout
      "<pre>#{obj.class}\n#{obj.pretty_inspect}</pre>"
    end
  end
end

Liquid::Template.register_filter(Jekyll::DebugFilter)
