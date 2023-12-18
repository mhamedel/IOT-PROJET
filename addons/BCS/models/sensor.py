from odoo import models, fields, api

class Sensor(models.Model):
    _name = 'res.sensor'
    _description = 'Modèle pour les capteurs'


    SENSOR_NAME = [
        ('tempHPH', 'Temperature, Humidity, PH'),
    ]
 
 
    # sensor_type = fields.Selection(SENSOR_TYPES, string='Type de Capteur', required=True)
    name = fields.Selection(SENSOR_NAME, string='Nom du capteur' , required=True, default='tempHPH')
    label = fields.Char(string='Label', store=True)
    zone = fields.Many2one('res.zone', string='Zone' , required=True, ondelete='cascade')
    id_cle=fields.Char(string='ID capteur', compute='_compute_id_cle')
    zone_name=fields.Char(string='Nom de la zone' , compute='_compute_zone_name', store=True )
    farm_name=fields.Char(string='Nom de la farm' , compute='_compute_farm_name', store=True )
    readings = fields.One2many('res.data', 'sensor', string='Lectures')
    
    @api.depends('name', 'zone')
    def _compute_id_cle(self):
        for record in self:
            # You can customize the logic to generate a unique static value
            hash_value = hash((record.zone.id))  # Example: Using a hash of name and zone ID
            alphabetic_prefix = record.farm_name[0].upper() if record.farm_name else 'A'
            record.id_cle = f'{alphabetic_prefix}{hash_value:05d}'  # Example: Alphabetic prefix + hash value with leading zeros

    @api.depends('zone')
    def _compute_farm_name(self):
        for sensor in self:
            sensor.farm_name = sensor.zone.farm_name


    @api.depends('zone')
    def _compute_zone_name(self):
        for sensor in self:
            sensor.zone_name = sensor.zone.name