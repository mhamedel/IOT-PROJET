from odoo import fields, api, models

class Farm(models.Model):
    _name = 'res.farm'
    _description = 'Modèle pour les fermes'

    client = fields.Many2one('res.users', string='Client' , required=True )
    zones = fields.One2many('res.zone', 'farm', string='Zones' )
    name = fields.Char(string='Nom de la Ferme', compute='_compute_farm_name', store=True)
    label = fields.Char(string='Label', store=True)
    N_zones = fields.Integer(string='Nombre des Zones', compute='_compute_n_zones', store=True)
    N_sensors = fields.Integer(string='Nombre des Capteurs', compute='_compute_n_sensors', store=True)

    @api.depends('zones')
    def _compute_n_zones(self):
        for farm in self:
            farm.N_zones = len(farm.zones)
    
    @api.depends('zones','zones.N_sensors')
    def _compute_n_sensors(self):
        for farm in self:
            farm.N_sensors = sum(zone.N_sensors for zone in farm.zones)
 

    @api.depends('client.name')
    def _compute_farm_name(self):
        for farm in self:
            farm.name = f"{farm.client.name}_Ferme_{farm.client.N_farms}"
    

