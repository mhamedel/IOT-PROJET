from odoo import http
from datetime import datetime, timedelta
from odoo.http import request
import random  # Import the random module
import json

class SensorWebController(http.Controller):

    
   
    @http.route('/my', type='http', auth="user", website=True)
    def sensor_data_page(self, **kw):
        user = request.env.user
        user_image =  bool(user.partner_id.image_1920)
       # Rechercher les fermes liées à l'utilisateur connecté
        farms = request.env['res.farm'].search([('client', '=', user.id)])
        result = []
        for farm in farms:
            farm_info = {
            'farm_id': farm.id,
            'farm_name': farm.name,
            'farm_label': farm.label or farm.name,
            'zones': [{'zone_id': zone.id, 'zone_label': zone.label or zone.name } for zone in farm.zones],
             }
            result.append(farm_info)
            # result[0].['zones'].[0]['zone_id']
        first_farm_id=result[0]['farm_id'] if result else None
        first_farm_label=result[0]['farm_label']if result else None
        first_zone_id=result[0]['zones'][0]['zone_id'] if result and result[0]['zones'] else None
        first_zone_label=result[0]['zones'][0]['zone_label']if result and result[0]['zones'] else None
       
        return http.request.render('WSC.layouts', {
            'user': user,
            'user_image': user_image,
            'result':result,
            'first_farm_id': first_farm_id,
            'first_farm_label': first_farm_label,
            'first_zone_id': first_zone_id,
            'first_zone_label': first_zone_label,
        })
   
    
    
    
    @http.route('/web/get_zones', type='http', auth="user", website=True)
    def get_zones(self, **kw):
        user = request.env.user
        farm_id = kw.get('farm_id')
        
        if farm_id:
            farm = request.env['res.farm'].sudo().browse(int(farm_id))
            if farm:
                zone_info = []
                for zone in farm.zones:
                    zone_info.append({
                        'id': zone.id,
                        'name': zone.name,
                        'label': zone.label or zone.name,
                    })
        return request.make_response(json.dumps(zone_info), headers=[('Content-Type', 'application/json')])

      
    @http.route('/web/get_sensor', type='http', auth="user", website=True)
    def get_sensor(self, **kw):
        user = request.env.user
        zone_id = kw.get('zone_id')

        # Récupérez les identifiants des sensor associées à la zone
        zone_data = request.env['res.zone'].search([('id', '=', zone_id)]).read(['sensors'])
        # Récupérez les données des zones associées
        sensors_data_id_cle = request.env['res.sensor'].browse(zone_data[0]['sensors']).read(['id_cle'])
        T=generate_random_data(24)
        H=generate_random_data(24)
        P=generate_random_data(24)
        S=generate_random_data(24)
        
        data = []
        data.append({'temperature': T})
        data.append({'humidity': H})
        data.append({'pH': P})
        data.append({'another_parameter': S})

        return request.make_response(json.dumps(data), headers=[('Content-Type', 'application/json')])


    @http.route('/device/save_log', type='json', auth='none', methods=['POST'])
    def receive_iot_data(self, **post):
        
        return request.make_response(json.dumps(post), headers=[('Content-Type', 'application/json')])
    


def generate_random_data(length):
        data = []
        now = datetime.now().replace(minute=0, second=0, microsecond=0)

        for i in range(length):
            timestamp = now - timedelta(hours=i)
            value = round(0 + random.uniform(0, 50), 2)  # Adjust the range and precision as needed

            data.append({
                'y': value
            })
        return data
    
  