from odoo import models, fields, api

class Data(models.Model):
    _name = 'res.data'
    _description = 'Model for storing sensor readings'

    sensor = fields.Many2one('res.sensor', string='Capteur', ondelete='cascade')
    value = fields.Float(string='Valeur captée')
    timestamp = fields.Datetime(string='Timestamp', default=fields.Datetime.now)
