# DowntownSeattleParking.com

The parking site is built in Jekyll, which produces a set of static
files for uploading to any regular web host. Dynamic magic happens
entirely via javascript. The home page is the single-page desktop site
at large resolutions, but shows the mobile layout via CSS media query on
small screens.


## Dependencies

* Ruby 1.9.3
* jekyll and haversine gems (included in Gemfile; use `bundle install`)
* Google maps javascript API v3
* e-Park data from Seattle public data site. The main JSON feed used for
  retrieving available parking spaces is:
    http://data.seattle.gov/resource/3neb-8edu.json
  Human-readable(ish) data here:
    https://data.seattle.gov/Transportation/Public-Parking-Garages-and-Lots/3neb-8edu


## Running a Development Server

1. `jekyll serve --watch --trace`

Jekyll runs a server on http://localhost:4000

Note: changes to generators and filters in the `_plugins` directory
aren't automatically picked up by the --watch option. You'll need to
stop the Jekyll server and restart it to see changes to that code.


## Deployment to Staging

1. `jekyll build`
2.  `./stage`

The stage script is just a wrapper around rsync to copy the files up to
the correct folder on Media Temple (http://staging.copacino.com/parking).


## Deployment to Customer

1. `jekyll build`
2. `./package`

Jekyll builds everything in the `_site` folder. The package script zips
up the site into parking-site.zip in the `_build` folder.
