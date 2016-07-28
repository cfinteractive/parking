require 'json'

module Jekyll
  class LotPage < Page
    def initialize(site, base, dir, lot)
      @site = site
      @base = base
      @dir = dir
      @name = 'index.html'

      self.process(@name)
      self.read_yaml(File.join(base, '_layouts'), 'lot.html')
      lot.keys.each do |key|
        self.data[key] = lot[key]
      end
      self.data['directions_url'] = directions_url
      if self.data['buslic_location_id']
        self.data['scripts'] << 'js/epark.js'
      end
    end

    def directions_url
      url = 'https://maps.google.com/maps?daddr='
      url << self.data['address'].gsub(/ /, '+')
      url << ',+Seattle,+WA' 
      url << '&hl=en&ll=' 
      url << self.data['lat'].to_s
      url << ','
      url << self.data['lng'].to_s
      url << '&z=16'
    end
  end

  class DestinationPage < Page
    def initialize(site, base, dir, destination, lots)
      @site = site
      @base = base
      @dir = dir
      @name = 'index.html'

      self.process(@name)
      self.read_yaml(File.join(base, '_layouts'), 'destination.html')
      destination.keys.each do |key|
        self.data[key] = destination[key]
      end

      loc = [destination['lat'], destination['lng']]
      nearby_lots = lots.dup
      nearby_cheap_lots = []
      has_epark = false
      slugs = []
      nearby_lots.reject! do |lot|
        has_epark = true if lot['buslic_location_id']
        lot['distance'] = Haversine.distance(loc, [lot['lat'], lot['lng']]) * Haversine::EARTH_RADIUS_MILES
        lot_dir = site.config['lot_dir'] || 'lots'

        lot['page_url'] = "#{self.data['prefix']}#{lot_dir}/#{Jekyll.build_slug(lot['title'], slugs)}"

        if (lot['distance'] < 0.55) && ((lot['low_cost']) && (nearby_cheap_lots.size < 3))
          nearby_cheap_lots << lot
        end
        (lot['distance'] >= 0.55) || ((lot['low_cost']) && (nearby_cheap_lots.size < 3))
      end
      nearby_lots.sort! do |a, b|
        a['distance'] <=> b['distance']
      end
      nearby_cheap_lots.sort! do |a, b|
        a['distance'] <=> b['distance']
      end
      self.data['nearby_lots'] = []
      nearby_lots.each do |lot|
        self.data['nearby_lots'] << lot.clone
      end
      self.data['nearby_cheap_lots'] = []
      nearby_cheap_lots.each do |lot|
        self.data['nearby_cheap_lots'] << lot.clone
      end

      if has_epark
        if self.data['scripts']
          self.data['scripts'] << 'js/epark.js'
        else
          self.data['scripts'] = ['js/epark.js']
        end
      end
    end
  end

  class HomePage < Page
    def initialize(site, base, lots)
      @site = site
      @base = base
      @dir = '/'
      @name = 'index.html'

      self.process(@name)
      self.read_yaml(File.join(base, '_layouts'), 'home.html')

      self.data['lots'] = []
      self.data['twenty_four_lots'] = []
      self.data['evening_lots'] = []
      self.data['commuter_lots'] = []
      self.data['late_night_lots'] = []
      slugs = []
      lot_dir = site.config['lot_dir'] || 'lots'
      lots.each do |lot|
        lot['page_url'] = "#{lot_dir}/#{Jekyll.build_slug(lot['title'], slugs)}"
        self.data['lots'] << lot.dup

        case lot['hours_sorting']
        when '24_hour'
          self.data['twenty_four_lots'] << lot.dup
        when 'evening'
          self.data['evening_lots'] << lot.dup
        when 'commuter'
          self.data['commuter_lots'] << lot.dup
        when 'late_night'
          self.data['late_night_lots'] << lot.dup
        end
      end

      self.data['twenty_four_lots'].sort! {|a,b| a['title'] <=> b['title']}
      self.data['evening_lots'].sort! {|a,b| a['title'] <=> b['title']}
      self.data['commuter_lots'].sort! {|a,b| a['title'] <=> b['title']}
      self.data['late_night_lots'].sort! {|a,b| a['title'] <=> b['title']}
    end
  end

  class LotIndexPage < Page
    def initialize(site, base, dir, page_dir, lots, options = {})
      @site = site
      @base = base
      @dir = dir
      @name = 'index.html'

      self.process(@name)
      self.read_yaml(File.join(base, '_layouts'), 'lot_index.html')

      self.data['lots'] = []
      has_epark = false
      slugs = []
      lots.each do |lot|
        lot['page_url'] = "#{self.data['prefix']}#{page_dir}/#{Jekyll.build_slug(lot['title'], slugs)}"
        self.data['lots'] << lot.dup
        has_epark = true if lot['buslic_location_id']
      end

      options.keys.each do |key|
        self.data[key] = options[key]
      end
      if options['geolocate_on_open']
        self.data['scripts'] << 'js/geolocate.js'
      end

      if has_epark
        self.data['scripts'] << 'js/epark.js'
      end
    end
  end

  class ViewOnMapPage < Page
    def initialize(site, base, dir, lots)
      @site = site
      @base = base
      @dir = dir
      @name = 'index.html'

      self.process(@name)
      self.read_yaml(File.join(base, '_layouts'), 'view_on_map.html')

      lot_dir = site.config['lot_dir'] || 'lots'
      self.data['lots'] = []
      has_epark = false
      slugs = []
      lots.each do |lot|
        lot['page_url'] = "#{self.data['prefix']}#{lot_dir}/#{Jekyll.build_slug(lot['title'], slugs)}"
        self.data['lots'] << lot.dup
        has_epark = true if lot['buslic_location_id']
      end

      if has_epark
        self.data['scripts'] << 'js/epark.js'
      end
    end
  end

  class GarageHoursPage < Page
    def initialize(site, base, dir, lots)
      @site = site
      @base = base
      @dir = dir
      @name = 'index.html'

      self.process(@name)
      self.read_yaml(File.join(base, '_layouts'), 'garage_hours.html')

      lot_dir = site.config['lot_dir'] || 'lots'
      self.data['twenty_four_lots'] = []
      self.data['evening_lots'] = []
      self.data['commuter_lots'] = []
      self.data['late_night_lots'] = []
      has_epark = false
      slugs = []
      lots.each do |lot|
        lot['page_url'] = "#{self.data['prefix']}#{lot_dir}/#{Jekyll.build_slug(lot['title'], slugs)}"
        case lot['hours_sorting']
        when '24_hour'
          self.data['twenty_four_lots'] << lot.dup
        when 'evening'
          self.data['evening_lots'] << lot.dup
        when 'commuter'
          self.data['commuter_lots'] << lot.dup
        when 'late_night'
          self.data['late_night_lots'] << lot.dup
        end
        has_epark = true if lot['buslic_location_id']
      end
      self.data['twenty_four_lots'].sort! {|a,b| a['title'] <=> b['title']}
      self.data['evening_lots'].sort! {|a,b| a['title'] <=> b['title']}
      self.data['commuter_lots'].sort! {|a,b| a['title'] <=> b['title']}
      self.data['late_night_lots'].sort! {|a,b| a['title'] <=> b['title']}

      if has_epark
        if self.data['scripts']
          self.data['scripts'] << 'js/epark.js'
        else
          self.data['scripts'] = ['js/epark.js']
        end
      end
    end
  end

  class NeighborhoodsPage < Page
    def initialize(site, base, dir, lots)
      @site = site
      @base = base
      @dir = dir
      @name = 'index.html'

      self.process(@name)
      self.read_yaml(File.join(base, '_layouts'), 'neighborhoods.html')

      lot_dir = site.config['lot_dir'] || 'lots'
      self.data['waterfront_lots'] = []
      self.data['pioneer_lots'] = []
      self.data['retail_lots'] = []
      has_epark = false
      slugs = []
      lots.each do |lot|
        lot['page_url'] = "#{self.data['prefix']}#{lot_dir}/#{Jekyll.build_slug(lot['title'], slugs)}"
        case lot['neighborhood']
        when 'waterfront'
          self.data['waterfront_lots'] << lot.dup
        when 'pioneer'
          self.data['pioneer_lots'] << lot.dup
        when 'retail'
          self.data['retail_lots'] << lot.dup
        end
        has_epark = true if lot['buslic_location_id']
      end
      self.data['waterfront_lots'].sort! {|a,b| a['title'] <=> b['title']}
      self.data['pioneer_lots'].sort! {|a,b| a['title'] <=> b['title']}
      self.data['retail_lots'].sort! {|a,b| a['title'] <=> b['title']}

      if has_epark
        if self.data['scripts']
          self.data['scripts'] << 'js/epark.js'
        else
          self.data['scripts'] = ['js/epark.js']
        end
      end
    end
  end

  class GenerateLots < Generator
    safe true

    def generate(site)
      if site.layouts.key? 'lot'
        # Read lot data from javascript file
        lot_data_file = site.config['lot_data'] || 'js/lots-data.js'
        lot_dir = site.config['lot_dir'] || 'lots'
        lots = []
        if lot_data_file
          File.open(File.join(site.source, lot_data_file), 'r') do |f|
            lot_data = f.read()
            lot_data.gsub!(/parking\.lots = /, '')
            lot_data.gsub!(/\];/, ']')
            lots = JSON.parse(lot_data)
          end
        end

        # Home page
        site.pages << HomePage.new(site, site.source, lots)

        # Individual lot pages
        slugs = []
        lots.each do |lot|
          site.pages << LotPage.new(site, site.source, File.join(lot_dir, Jekyll.build_slug(lot['title'], slugs)), lot)
        end

        # Near Me page
        options = {
          'title' => 'NEAR ME',
          'no_sort' => true,
          'geolocate_on_open' => true
        }
        site.pages << LotIndexPage.new(site, site.source, 'near', lot_dir, lots, options)

        # Read destination data from javascript file
        dest_data_file = site.config['dest_data'] || 'js/destinations.js'
        dest_dir = site.config['dest_dir'] || 'destinations'
        destinations = []
        if dest_data_file
          File.open(File.join(site.source, dest_data_file), 'r') do |f|
            dest_data = f.read()
            dest_data.gsub!(/parking\.destinations = /, '')
            dest_data.gsub!(/\];/, ']')
            destinations = JSON.parse(dest_data)
          end
        end

        # Popular Destinations index
        dest_options = {
          'title' => 'POPULAR DESTINATIONS',
          'no_sort' => false
        }
        site.pages << LotIndexPage.new(site, site.source, dest_dir, dest_dir, destinations, dest_options)

        # Popular Destinations pages
        slugs = []
        destinations.each do |destination|
          site.pages << DestinationPage.new(site, site.source, File.join(dest_dir, Jekyll.build_slug(destination['title'], slugs)), destination, lots)
        end

        # $3/hour garages
        cheap_options = {
          'title' => '$3/HOUR GARAGES',
          'no_sort' => false,
          'intro' => site.config['3dollar_intro']
        }
        cheap_lots = lots.select do |lot|
          lot['low_cost'] == true
        end
        site.pages << LotIndexPage.new(site, site.source, '3dollar', lot_dir, cheap_lots, cheap_options)

        # $7 flat rate garages
        flat_options = {
          'title' => '$7 OR LESS (EVE & WKND)',
          'no_sort' => false,
          'intro' => site.config['flat_intro']
        }
        flat_lots = lots.select do |lot|
          lot['flat_rate'] == true
        end
        site.pages << LotIndexPage.new(site, site.source, 'flat-rate', lot_dir, flat_lots, flat_options)

        # e-Park garages
        epark_options = {
          'title' => 'e-PARK GARAGES',
          'no_sort' => false,
          'intro' => site.config['epark_intro'],
          'footer_links' => site.config['epark_footer_links']
        }
        epark_lots = lots.select do |lot|
          lot['epark'] == true
        end
        site.pages << LotIndexPage.new(site, site.source, 'epark', lot_dir, epark_lots, epark_options)

        # View on Map page
        site.pages << ViewOnMapPage.new(site, site.source, 'map', lots)

        # Garage hours
        site.pages << GarageHoursPage.new(site, site.source, 'hours', lots)

        # View by Neighborhood
        site.pages << NeighborhoodsPage.new(site, site.source, 'neighborhoods', lots)
      end
    end
  end

  def self.build_slug(title, slugs)
    slug = title.parameterize
    suffix = /[0-9]+$/
    while slugs.include? slug
      ending = suffix.match(slug)
      if ending
        slug.sub!(suffix, "#{ending[0].to_i + 1}")
      else
        slug = "#{slug}-2"
      end
    end
    slugs << slug
    slug
  end
end

class String
  def parameterize(sep = '-')
    parameterized_string = self.to_s.dup
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

module Haversine

  RAD_PER_DEG = Math::PI / 180
  EARTH_RADIUS_MILES = 3959

  # given two lat/lon points, compute the distance between the two points using the haversine formula
  def self.distance(lat1, lon1, lat2=nil, lon2=nil)
    # Accept two arrays of points in addition to four coordinates
    if lat1.is_a?(Array) && lon1.is_a?(Array)
      lat2, lon2 = lon1
      lat1, lon1 = lat1
    elsif lat2.nil? || lon2.nil?
      raise ArgumentError
    end

    dlon = lon2 - lon1
    dlat = lat2 - lat1

    a = calc(dlat, lat1, lat2, dlon)
    c = 2 * Math.atan2( Math.sqrt(a), Math.sqrt(1-a))
  end

  def self.calc(dlat, lat1, lat2, dlon)
    (Math.sin(rpd(dlat)/2))**2 + Math.cos(rpd(lat1)) * Math.cos((rpd(lat2))) * (Math.sin(rpd(dlon)/2))**2
  end

  # Radians per degree
  def self.rpd(num)
    num * RAD_PER_DEG
  end
end
